import aiohttp
import asyncio
import time
from bs4 import BeautifulSoup
import random

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
}

TIBIA_WORLD_URL = "https://www.tibia.com/community/?subtopic=worlds&world="
TIBIA_CHARACTER_URL = "https://www.tibia.com/community/?subtopic=characters&name="

last_online_players = set()
last_deaths = {}


async def fetch_online_players(session, world_name):
    """Obtiene la lista de jugadores en línea de un servidor de Tibia."""
    url = f"{TIBIA_WORLD_URL}{world_name}"

    try:
        async with session.get(url) as response:
            if response.status != 200:
                print(f"❌ Error {response.status}: No se pudo obtener la lista de jugadores en línea.")
                return set()

            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")

            # Buscar la tabla de jugadores en línea
            players_table = soup.find("table", class_="Table2")
            if not players_table:
                print(f"⚠️ No se encontraron jugadores en línea en {world_name}.")
                return set()

            # Extraer nombres de los jugadores
            players = {
                row.find("a").text
                for row in players_table.find_all("tr")[1:]  # Omitir la primera fila (encabezados)
                if row.find("a")
            }

            return players

    except Exception as e:
        print(f"❌ Error al obtener los jugadores en línea: {e}")
        return set()


async def get_character_deaths(session, character_name):
    """Obtiene las muertes recientes de un personaje."""
    global last_deaths

    url = f"{TIBIA_CHARACTER_URL}{character_name.replace(' ', '+')}&nocache={int(time.time())}"

    try:
        async with session.get(url) as response:
            if response.status != 200:
                print(f"❌ Error al obtener la página de {character_name}.")
                return None

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


async def monitor_server_deaths(world_name, interval=10):
    """Monitorea los jugadores en línea de un servidor y verifica sus muertes recientes."""
    global last_online_players

    async with aiohttp.ClientSession(headers=HEADERS) as session:
        while True:
            print(f"\n🔍 Verificando jugadores en línea en '{world_name}'...")
            current_online_players = await fetch_online_players(session, world_name)

            # Detectar cambios en la lista de jugadores en líneaSolid
            if current_online_players != last_online_players:
                added = current_online_players - last_online_players
                removed = last_online_players - current_online_players

                if added:
                    print(f"🆕 Nuevos jugadores conectados: {', '.join(added)}")
                if removed:
                    print(f"❌ Jugadores desconectados: {', '.join(removed)}")

                last_online_players = current_online_players

            elif current_online_players:
                print(f"👥 Jugadores en línea: {', '.join(current_online_players)}")

            # Verificar muertes solo para los jugadores en línea
            if current_online_players:
                await asyncio.gather(*(get_character_deaths(session, player) for player in current_online_players))
            else:
                print("⚠️ No hay jugadores en línea en el servidor.")

            print(f"⏳ Próxima verificación en {interval} segundos...\n")
            await asyncio.sleep(interval)


async def main():
    world_name = input("Ingrese el nombre del servidor: ").strip()
    print(f"\n⏳ Iniciando monitoreo de jugadores en '{world_name}'...\n")
    await monitor_server_deaths(world_name, interval=1)  # Monitorear cada 30 segundos


if __name__ == "__main__":
    asyncio.run(main())
