import asyncio
import time
import aiohttp
import requests
from bs4 import BeautifulSoup
import tibiapy

TIBIA_CHARACTER_URL = "https://www.tibia.com/community/?subtopic=characters&name="

# Configurar headers para evitar caché
HEADERS = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}

session = requests.Session()
session.headers.update(HEADERS)

# Almacenar la lista de muertes y miembros en línea previos
last_deaths = {}
last_online_members = set()

async def fetch_guild_members(guild_name):
    """Obtiene los miembros en línea de una guild en Tibia."""
    client = tibiapy.Client()

    try:
        response = await client.fetch_guild(guild_name)
        guild = response.data

        if guild is None:
            print(f"❌ No se encontró la guild '{guild_name}'.")
            return set()

        online_members = {member.name for member in guild.online_members}
        print(online_members)
        return online_members
    

    except Exception as e:
        print(f"❌ Error al obtener la información de la guild: {e}")
        return set()

    finally:
        await client.session.close()

