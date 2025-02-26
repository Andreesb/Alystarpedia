import requests
import time

TIBIADATA_API_URL = "https://api.tibiadata.com/v4/character/"

def get_deaths_tibiadata(character_name):
    """Extrae la lista de muertes de un personaje usando la API de TibiaData."""
    url = f"{TIBIADATA_API_URL}{character_name.replace(' ', '%20')}"
    start_time = time.time()  # ⏳ Medir tiempo de respuesta
    response = requests.get(url)
    elapsed_time = time.time() - start_time  # ⏱ Tiempo transcurrido

    if response.status_code != 200:
        print(f"Error al obtener datos desde TibiaData ({response.status_code})")
        return [], elapsed_time

    data = response.json()
    deaths = data.get("characters", {}).get("deaths", [])
    
    return deaths, elapsed_time

def monitor_character_deaths_tibiadata(character_name, check_interval=1):
    """Monitorea el personaje y publica la muerte más reciente si cambia."""
    print(f"Monitoreando las muertes de: {character_name} usando TibiaData...")

    last_deaths, first_request_time = get_deaths_tibiadata(character_name)
    last_death_count = len(last_deaths)

    while True:
        time.sleep(check_interval)  # Esperar antes de hacer la siguiente consulta

        current_deaths, response_time = get_deaths_tibiadata(character_name)
        current_death_count = len(current_deaths)

        print(f"🔄 Tiempo de respuesta: {response_time:.4f} segundos")

        if current_death_count > last_death_count:
            new_death = current_deaths[0]  # La muerte más reciente
            print(f"🆕 Nueva muerte detectada: {new_death['date']} - {new_death['reason']}")
            last_death_count = current_death_count  # Actualizar el conteo

if __name__ == "__main__":
    character_name = input("Ingrese el nombre del personaje: ")
    monitor_character_deaths_tibiadata(character_name)
