import aiohttp
import asyncio
import time
from bs4 import BeautifulSoup
import re
import time
import random

HEADERS_LIST = [
    {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.tibia.com/community/?subtopic=characters",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0"
    },
    {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Referer": "https://www.tibia.com/community/?subtopic=characters",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.5",
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0"
    },
    {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/115.0",
        "Referer": "https://www.tibia.com/community/?subtopic=characters",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "de-DE,de;q=0.5",
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0"
    }
]

COOKIES_LIST = [
    {"SecureSessionID": "session_1", "SessionLastVisit": "1741539473", "cf_clearance": "clearance_1"},
    {"SecureSessionID": "session_2", "SessionLastVisit": "1741539474", "cf_clearance": "clearance_2"},
    {"SecureSessionID": "session_3", "SessionLastVisit": "1741539475", "cf_clearance": "clearance_3"}
]

PROXIES = [
    "http://user:pass@45.140.143.77:18080",
    "http://user:pass@109.237.98.200:47100",
    "http://user:pass@200.174.198.86:8888"
]

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


async def get_character_deaths(session, character_name, retries=3):
    """Obtiene la muerte más reciente de un personaje con headers, cookies y proxy aleatorios."""
    url = f"{TIBIA_CHARACTER_URL}{character_name.replace(' ', '+')}"
    semaphore = asyncio.Semaphore(5)  # Limitar concurrencia

    async with semaphore:
        for attempt in range(retries):
            headers = random.choice(HEADERS_LIST)
            cookies = random.choice(COOKIES_LIST)
            proxy = random.choice(PROXIES)

            try:
                # Usa un solo diccionario de headers y cookies
                async with session.get(url, headers=headers, cookies=cookies, proxy=proxy) as response:
                    if response.status == 403:
                        print(f"⚠️ Intento {attempt + 1}/{retries} - 403 en {character_name}, cambiando headers/cookies/proxy...")
                        continue  

                    if response.status != 200:
                        print(f"❌ Error {response.status} en {character_name}.")
                        return None

                    soup = BeautifulSoup(await response.text(), "html.parser")
                    deaths_section = soup.find("div", string="Character Deaths")

                    if not deaths_section:
                        print(f"✅ {character_name} no tiene muertes registradas.")
                        return None

                    deaths_table = deaths_section.find_parent("div").find_next("table")
                    deaths = deaths_table.find_all("tr") if deaths_table else []

                    if deaths:
                        columns = deaths[0].find_all("td")
                        if len(columns) < 2:
                            return None

                        raw_text = columns[0].get_text(separator=" ", strip=True)
                        match = re.match(r'^(.*?CET\b.*?\.)', raw_text)
                        if match:
                            first_death = match.group(1).strip()
                            print(f"⚠️ Muerte detectada para {character_name}: {first_death}")
                            return first_death
            
            except Exception as e:
                print(f"❌ Error en {character_name}: {e}")

        print(f"❌ No se pudo verificar {character_name} después de {retries} intentos.")
        return None

async def check_deaths_for_players(session, player_list):
    """Verifica muertes para una lista de jugadores en paralelo y muestra los contadores."""
    counters = {"successes": 0, "failures": 0}
    
    # Ejecutar todas las solicitudes en paralelo
    tasks = [get_character_deaths(session, player, counters) for player in player_list]
    await asyncio.gather(*tasks)

    print(f"\n✅ Muertes verificadas correctamente: {counters['successes']}")
    print(f"❌ No se pudieron verificar: {counters['failures']}")



async def monitor_server_deaths(world_name, interval=10):
    """Monitorea los jugadores en línea de un servidor y verifica sus muertes recientes."""
    global last_online_players

    headers = random.choice(HEADERS_LIST)
    cookies = random.choice(COOKIES_LIST)
    proxy = random.choice(PROXIES)

    async with aiohttp.ClientSession(headers=headers, cookies=cookies) as session:
        while True:
            print(f"\n🔍 Verificando jugadores en línea en '{world_name}'...")
            current_online_players = await fetch_online_players(session, world_name)

            # Detectar cambios en la lista de jugadores en línea
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

            # Medir el tiempo de verificación
            if current_online_players:
                start_time = time.perf_counter()  # Iniciar temporizador
                await check_deaths_for_players(session, current_online_players)
                end_time = time.perf_counter()  # Terminar temporizador

                total_time = end_time - start_time
                print(f"⏱️ Tiempo total para verificar muertes: {total_time:.2f} segundos")

            else:
                print("⚠️ No hay jugadores en línea en el servidor.")

            print(f"⏳ Próxima verificación en {interval} segundos...\n")
            await asyncio.sleep(interval)


async def main():
    world_name = input("Ingrese el nombre del servidor: ").strip()
    print(f"\n⏳ Iniciando monitoreo de jugadores en '{world_name}'...\n")
    await monitor_server_deaths(world_name, interval=10)  # Monitorear cada 30 segundos


if __name__ == "__main__":
    asyncio.run(main())