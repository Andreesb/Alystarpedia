import requests
from bs4 import BeautifulSoup
import json
import time

import requests
from bs4 import BeautifulSoup

def get_item_links(category_url):
    """Obtiene los enlaces de los ítems de la segunda tabla con clase 'wikitable'."""
    response = requests.get(category_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    item_links = []
    
    #para extraer la primera tabla
    #table = soup.find('table', {'class': 'wikitable'})  # Obtener solo la primera tabla con la clase 'wikitable'

    #if table:
        #for row in table.find_all('tr')[1:]:  # Omitir el encabezado
            #link_tag = row.find('a')
            #if link_tag and 'href' in link_tag.attrs:
                #item_links.append("https://tibia.fandom.com" + link_tag['href'])


    #para extraer la segunda tabla
    #tables = soup.find_all('table', {'class': 'wikitable'})  # Obtener todas las tablas
    #second_table = tables[1] if len(tables) > 1 else (tables[0] if tables else None)  # Segunda tabla o la única disponible
    
    #if second_table:
        #rows = second_table.find_all('tr')[1:]  # Omitir la primera fila (encabezados)
        #for row in rows:
            #link_tag = row.find('a')
            #if link_tag and 'href' in link_tag.attrs:
                #item_links.append("https://tibia.fandom.com" + link_tag['href'])


    #para extraer dos tablas
    tables = soup.find_all('table', {'class': 'wikitable'})  # Obtener todas las tablas con la clase 'wikitable'

    for table in tables[:2]:  # Tomar máximo 2 tablas
        for row in table.find_all('tr')[1:]:  # Omitir el encabezado
            link_tag = row.find('a')
            if link_tag and 'href' in link_tag.attrs:
                item_links.append("https://tibia.fandom.com" + link_tag['href'])


    #para extraer tres tablas

    #tables = soup.find_all('table', {'class': 'wikitable'})  # Obtener todas las tablas con la clase 'wikitable'

    #item_links = []

    # Extraer datos solo de las primeras 3 tablas (si existen)
    #for table in tables[:3]:  # Tomar máximo 3 tablas
        #for row in table.find_all('tr')[1:]:  # Omitir el encabezado
            #link_tag = row.find('a')
            #if link_tag and 'href' in link_tag.attrs:
                #item_links.append("https://tibia.fandom.com" + link_tag['href'])

    
    return item_links


def convert_boolean(value):
    """Convierte símbolos en valores booleanos."""
    return True if value in ['✓', 'Yes'] else False

import requests
from bs4 import BeautifulSoup

def scrape_item_data(item_url):
    """Extrae información detallada de un ítem y asigna una imagen local según 'Item Class' o 'name'."""
    response = requests.get(item_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    item_data = {"url": item_url}
    
    # Extraer el nombre del ítem
    title = soup.find('h1', {'class': 'page-header__title'})
    item_data['name'] = title.text.strip() if title else "Unknown"
    
    # Extraer la URL de la imagen original
    image = soup.find('a', {'class': 'image'})
    item_data['image_url'] = image['href'] if image else "No image"
    
    attributes = {}
    infobox = soup.find('aside', {'role': 'region', 'class': 'portable-infobox'})
    if infobox:
        for data in infobox.find_all('div', {'class': 'pi-item pi-data pi-item-spacing pi-border-color'}):
            key_tag = data.find('h3', {'class': 'pi-data-label'})
            value_tag = data.find('div', {'class': 'pi-data-value'})
            if key_tag and value_tag:
                key = key_tag.text.strip()
                value = value_tag.text.strip()
                
                if key in ["Stackable", "Marketable", "Pickupable", "Blocking", "Usable"]:
                    value = convert_boolean(value)
                elif key in ["Sold for", "Bought for"]:
                    value = False if "not" in value.lower() else value

                attributes[key] = value
    
    item_data['attributes'] = attributes
    
    # Obtener "Item Class" si está presente
    item_class = attributes.get("Item Class", "").split(",")[0].strip() if "Item Class" in attributes else None
    
    # Diccionario de mapeo de clases a imágenes locales
    image_map = {
        "Silver Key": "../assets/icons/key_collector/Silver_Key.webp",
        "Golden Key": "../assets/icons/key_collector/Golden_Key.webp",
        "Copper Key": "../assets/icons/key_collector/Copper_Key.webp",
        "Wooden Key": "../assets/icons/key_collector/Wooden_Key.webp",
        "Bone Key": "../assets/icons/key_collector/Bone_Key.webp",
        "Crystal Key": "../assets/icons/key_collector/Crystal_Key.webp",
    }
    
    # Intentar asignar imagen basada en 'Item Class'
    if item_class and item_class in image_map:
        item_data["image_url"] = image_map[item_class]
        print(f"🔑 Imagen asignada por Item Class: {item_class} -> {item_data['image_url']}")
    else:
        # Si no tiene Item Class o no está en el diccionario, usar el nombre del ítem
        formatted_name = item_data["name"].replace(" ", "_")  # Reemplazar espacios por guiones bajos
        item_data["image_url"] = f"../assets/icons/key_collector/{formatted_name}.gif"
        print(f"📌 Imagen asignada por nombre: {item_data['name']} -> {item_data['image_url']}")

    # Extraer notas
    notes_section = soup.find('div', {'id': 'key-notes'}) or soup.find('div', {'id': 'object-notes'})
    item_data['notes'] = notes_section.text.strip() if notes_section else "No notes"
    
    # Extraer dropped by
    dropped_by_section = soup.find('div', {'id': 'item-droppedby'})
    item_data['dropped_by'] = [creature.text.strip() for creature in dropped_by_section.find_all('a')] if dropped_by_section else []

    # Extraer Buy from
    buy_section = soup.find('div', {'id': 'npc-trade-buyfrom'})
    if buy_section:
        table = buy_section.find('table', {'class': 'wikitable'})
        if table:
            rows = table.find_all('tr')[1:]  # Omitimos la primera fila porque es el encabezado
            buy_list = []
            for row in rows:
                cols = row.find_all('td')
                if len(cols) == 3:
                    npc = cols[0].get_text(strip=True)
                    location = cols[1].get_text(strip=True)
                    price = cols[2].get_text(strip=True)
                    buy_list.append(f"{npc} in {location} sells for {price}")
            item_data['buyfrom'] = buy_list if buy_list else ["Not sold by NPC's."]
        else:
            item_data['buyfrom'] = ["Not sold by NPC's."]
    
    # Extraer ubicación
    location_section = soup.find('div', {'id': 'creature-location'})
    item_data['location'] = " ".join(p.text.strip() for p in location_section.find_all('p')) if location_section else "Unknown"

    return item_data


def main():
    category_url = "https://tibia.fandom.com/wiki/Keys"
    output_file = "Keys.json"
    
    item_links = get_item_links(category_url)
    all_items_data = []
    
    for index, item_url in enumerate(item_links):
        print(f"Scraping ({index+1}/{len(item_links)}): {item_url}")
        item_data = scrape_item_data(item_url)
        all_items_data.append(item_data)
        #time.sleep(1)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_items_data, f, indent=4, ensure_ascii=False)
    
    print(f"Datos guardados en {output_file}")

if __name__ == "__main__":
    main()
