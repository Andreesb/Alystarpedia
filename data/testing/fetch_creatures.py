import requests
import json
import time

# URL de la API de TibiaData
BASE_URL = "https://api.tibiadata.com/v4"

# Función para obtener la lista de criaturas
def get_creatures():
    url = f"{BASE_URL}/creatures"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        creatures = data.get("creatures", {}).get("creature_list", [])
        
        return [creature["name"] for creature in creatures]  # Lista de nombres de criaturas
    else:
        print(f"Error al obtener criaturas: {response.status_code}")
        return []
    

# Función para obtener detalles de cada criatura
def get_creature_details(race):
    url = f"{BASE_URL}/creature/{race.replace(' ', '%20')}"  # Reemplazar espacios en la URL
    
    response = requests.get(url)

    if response.status_code == 200:
        
        return response.json().get("creature", {})  # Retorna los detalles de la criatura
    else:
        print(f"Error al obtener datos de {race}: {response.status_code}")
        return None

# Extraer y guardar información de criaturas
def fetch_and_save_creatures():
    creatures = get_creatures()
    all_creatures_data = {}

    for index, creature_name in enumerate(creatures):
        print(f"Obteniendo datos de: {creature_name} ({index+1}/{len(creatures)})")
        details = get_creature_details(creature_name)
        
        if details:
            all_creatures_data[creature_name] = details
        
        time.sleep(1)  # Evitar sobrecargar la API

    # Guardar los datos en un archivo JSON
    with open("creatures_data.json", "w", encoding="utf-8") as file:
        json.dump(all_creatures_data, file, indent=4, ensure_ascii=False)

    print("✅ Datos guardados en creatures_data.json")

# Ejecutar el script
if __name__ == "__main__":
    fetch_and_save_creatures()
