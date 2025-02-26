import asyncio
import time
import aiohttp
from bs4 import BeautifulSoup

TIBIA_CHARACTER_URL = "https://www.tibia.com/community/?subtopic=characters&name="

# Configurar headers para evitar caché
HEADERS = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}

# Variables globales para almacenar datos previos
last_deaths = {}
last_online_members = set()

async def fetch_guild_members(session, guild_name):
    """Obtiene los miembros en línea de una guild en Tibia mediante scraping."""
    url = f"https://www.tibia.com/community/?subtopic=guilds&page=view&GuildName={guild_name.replace(' ', '+')}"
    
    try:
        async with session.get(url) as response:
            if response.status != 200:
                print(f"❌ Error {response.status}: No se pudo obtener la página de la guild.")
                return set()
            
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")
            
            # Buscar todos los jugadores en línea
            online_members = {
                span.find_previous("a").text
                for span in soup.find_all("span", class_="green") 
                if span.b and span.b.text.lower() == "online"
            }

            return online_members
    
    except Exception as e:
        print(f"❌ Error al obtener la información de la guild: {e}")
        return set()
    

    

async def get_character_deaths(session, character_name):
    """Obtiene las muertes recientes de un personaje."""
    global last_deaths

    url = f"{TIBIA_CHARACTER_URL}{character_name.replace(' ', '+')}&nocache={int(time.time())}"

    try:
        async with session.get(url) as response:
            if response.status != 200:
                print(f"❌ Error al obtener la página de {character_name}.")
                return None  # No verificamos más si hay un error

            soup = BeautifulSoup(await response.text(), "html.parser")

            # Buscar la sección de Character Deaths
            deaths_section = soup.find("div", class_="Text", string="Character Deaths")
            if not deaths_section:
                print(f"✅ {character_name} no tiene muertes registradas.")
                return None

            deaths_table = deaths_section.find_parent("div", class_="CaptionInnerContainer").find_next("table")
            deaths = deaths_table.find_all("tr") if deaths_table else []

            # Extraer la muerte más reciente
            if deaths:
                last_death = (deaths[0].find_all("td")[0].text.strip(), deaths[0].find_all("td")[1].text.strip())
            else:
                return None  # No hay muertes
            
            if last_death:
                first_death = last_death[0]  # Tomar solo la primera muerte (fecha y descripción)

                # Comparar con la última muerte registrada
                if character_name not in last_deaths or last_deaths[character_name] != first_death:
                    last_deaths[character_name] = first_death
                    print(f"\n⚠️ ¡Nueva muerte detectada para {character_name}! ⚠️")
                    print(f"🆕 {first_death}\n")  # Imprime solo la nueva muerte limpia

                return first_death


    except Exception as e:
        print(f"❌ Error al obtener las muertes de {character_name}: {e}")
        return None

async def monitor_guild_deaths(guild_name, interval=10):
    """Monitorea los miembros en línea y verifica sus muertes recientes."""
    global last_online_members

    async with aiohttp.ClientSession(headers=HEADERS) as session:
        while True:
            print(f"\n🔍 Verificando miembros en línea de '{guild_name}'...")
            current_online_members = await fetch_guild_members(session, guild_name)
            
            # Detectar cambios en la lista de jugadores en línea
            if current_online_members != last_online_members:
                added = current_online_members - last_online_members
                removed = last_online_members - current_online_members

                if added:
                    print(f"🆕 Nuevos jugadores conectados: {', '.join(added)}")
                if removed:
                    print(f"❌ Jugadores desconectados: {', '.join(removed)}")

                last_online_members = current_online_members

            elif current_online_members:
                print(f"👥 Miembros en línea: {', '.join(current_online_members)}")

            # Verificar muertes solo para los jugadores en línea
            if current_online_members:
                await asyncio.gather(*(get_character_deaths(session, member) for member in current_online_members))
            else:
                print("⚠️ No hay miembros en línea en la guild.")

            print(f"⏳ Próxima verificación en {interval} segundos...\n")
            await asyncio.sleep(interval)

async def main():
    guild_name = input("Ingrese el nombre de la guild: ").strip()
    print(f"\n⏳ Iniciando monitoreo de la guild '{guild_name}'...\n")
    await monitor_guild_deaths(guild_name, interval=1)  # Monitorear cada 30 segundos

if __name__ == "__main__":
    asyncio.run(main())
