import requests
import time
import aiosqlite, aiohttp, asyncio
from urllib.parse import quote
import sys
from bs4 import BeautifulSoup
from lxml import html
import aiofiles
import re

sys.path.append("D:/Delinger/Documents/GitHub/Bontar/Bot/")
from functions.utils import get_monster_url
from functions import functions_db




import aiosqlite
import asyncio

def extract_data(soup):
    aside = soup.select_one('#mw-content-text > div > div > aside')
    data = {}

    if aside:
        sections = aside.find_all("section", class_="pi-item pi-group pi-border-color")

        for section in sections:
            header = section.find("h2", class_="pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background")
            
            if header:
                section_name = header.text.strip()
                data[section_name] = {}

                items = section.find_all("div", class_="pi-item pi-data pi-item-spacing pi-border-color")

                for item in items:
                    label = item.find("h3", class_="pi-data-label pi-secondary-font")
                    value = item.find("div", class_="pi-data-value pi-font")

                    if label and value:
                        clean_value = value.get_text(separator=" ", strip=True)
                        data[section_name][label.text.strip()] = clean_value

    # Extraer secciones adicionales fuera del <aside>
    extra_sections = {
        "Notes": "creature-notes",
        "Abilities": "creature-abilities",
        "Resistance": "creature-resistance-table",
        "Location": "creature-location",
        "Behaviour": "creature-behaviour",
        "Strategy": "creature-strategy",
        "Loot": "creature-loot"
    }

    for section_name, section_id in extra_sections.items():
        section = soup.find(id=section_id)
        if section:
            text_content = section.get_text(separator=" ", strip=True)
            clean_value = text_content.replace(section_name, "").strip()  # Elimina el nombre de la sección del valor
            data[section_name] = clean_value if clean_value else "Unknown"

    return data

def process_data(data):
    """Convierte valores específicos en booleanos dentro del diccionario de datos."""
    def recursive_process(value):
        if isinstance(value, dict):
            return {k: recursive_process(v) for k, v in value.items()}
        elif isinstance(value, str):
            return False if value.strip() in ['✗', 'No', '?'] else (True if value.strip() in ['✓', 'Yes'] else value)
        return value

    return recursive_process(data)


def format_data(data):
    # Separar elementos en 'Behavioural Properties'
    if "Behavioural Properties" in data and "Walks Around" in data["Behavioural Properties"]:
        data["Behavioural Properties"]["Walks Around"] = ", ".join(data["Behavioural Properties"]["Walks Around"].split())

    # Formatear 'Resistance'
    if "Resistance" in data:
        resistance = data["Resistance"].replace("Damage Taken From Elements ", "")
        elements = ["Physical", "Death", "Holy", "Ice", "Fire", "Energy", "Earth"]
        formatted_resistance = []
        
        for element in elements:
            if element in resistance:
                start = resistance.index(element)
                end = resistance.find("%", start) + 1
                formatted_resistance.append(resistance[start:end].strip())

        data["Resistance"] = ", ".join(formatted_resistance)

    # Formatear 'Location'
    if "Location" in data:
        data["Location"] = data["Location"].replace(", around here .", "").strip()

    # Formatear 'Loot'
    if "Loot" in data:
        data["Loot"] = data["Loot"].replace("(  Statistics )", "").strip()
    return data


import aiosqlite
from urllib.parse import quote

import aiosqlite
import aiofiles
from urllib.parse import quote

async def save_monster_data(name, wiki_url, wiki_data, db_path="data/databases/bontar_data.db"):
    img_url = f"https://tibia.fandom.com/wiki/Special:Redirect/file/{quote(name)}.gif"

    query = """
        INSERT INTO monsters (
            name, wiki_url, image_url, hp, exp, exp_animus, speed, armor, mitigation, 
            est_dmg, summon, convince, general_class, spawn_type, illusionable, pushable, pushes, 
            bestiary_class, charm_points, kills_unlock, paralysable, sense_invis, walks_around, 
            notes, abilities, resistance, location, behaviour, strategy, loot
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    values = (
        name,
        wiki_url,
        img_url,
        wiki_data.get("Combat Properties", {}).get("Health", "Unknown"),
        wiki_data.get("Combat Properties", {}).get("Experience", "Unknown"),
        wiki_data.get("Combat Properties", {}).get("Animus", "Unknown"),
        wiki_data.get("Combat Properties", {}).get("Speed", "Unknown"),
        wiki_data.get("Combat Properties", {}).get("Armor", "Unknown"),
        wiki_data.get("Combat Properties", {}).get("Mitigation", "Unknown"),
        wiki_data.get("Combat Properties", {}).get("Est. Max Dmg", "Unknown"),
        wiki_data.get("Combat Properties", {}).get("Summon", "Unknown"),
        wiki_data.get("Combat Properties", {}).get("Convince", "Unknown"),
        wiki_data.get("General Properties", {}).get("Classification", "Unknown"),
        wiki_data.get("General Properties", {}).get("Spawn Type", "Unknown"),
        wiki_data.get("General Properties", {}).get("Illusionable", False),
        wiki_data.get("General Properties", {}).get("Pushable", False),
        wiki_data.get("General Properties", {}).get("Pushes", False),
        wiki_data.get("Bestiary Properties", {}).get("Class", "Unknown"),
        wiki_data.get("Bestiary Properties", {}).get("Charm Points", "Unknown"),
        wiki_data.get("Bestiary Properties", {}).get("Kills to Unlock", "Unknown"),
        wiki_data.get("Immunity Properties", {}).get("Paralysable", False),
        wiki_data.get("Immunity Properties", {}).get("Sense Invis", False),
        wiki_data.get("Behavioural Properties", {}).get("Walks Around", "Unknown"),
        wiki_data.get("Notes", "Unknown"),
        wiki_data.get("Abilities", "Unknown"),
        wiki_data.get("Resistance", "Unknown"),
        wiki_data.get("Location", "Unknown"),
        wiki_data.get("Behaviour", "Unknown"),
        wiki_data.get("Strategy", "Unknown"),
        wiki_data.get("Loot", "Unknown")
    )


    try:
        async with aiosqlite.connect(db_path) as db:
            await db.execute(query, values)
            await db.commit()
            print(f"Saved {name}")
    except Exception as e:
        print(f"Error guardando {name}: {str(e)}")
       
def parse_boolean(value):
    """Convierte valores de texto en booleanos según símbolos específicos."""
    return value.strip() in ['✓', 'Yes', '✗', 'No']

def scrape_monster_data(name, wiki_url):
    item_data = {}
    item_data['name'] = name

    

    """Extrae información detallada de la pagina"""
    response = requests.get(wiki_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    data = extract_data(soup)
    data = process_data(data)
    data = format_data(data)

    
    
        
    return data




async def main():

    #bosses_name =  await functions_db.get_bosses_name()
    
    # Leer los nombres del archivo
    with open("monsters_name.txt", "r") as file:
        bosses_name = [line.strip() for line in file.readlines()]

    for name in bosses_name:
        name = name.replace("Of", "of").replace("The", "the")
        # if name == "Ancient Spawn of Morgathla":
        #     print("here we go")
        wiki_url = f"https://tibia.fandom.com/wiki/{quote(name)}"

        wiki_data = scrape_monster_data(name, wiki_url)

        if wiki_data:
            await save_monster_data(name, wiki_url, wiki_data)
        else:
            error_message = f"{name}\n"
            async with aiofiles.open("errors2.txt", "a") as f:
                await f.write(error_message)


asyncio.run(main())
