import requests
from bs4 import BeautifulSoup
import time

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

# Almacenar la lista de muertes previa
last_deaths = None

def get_character_deaths(character_name):
    """Obtiene la lista de muertes del personaje."""
    global last_deaths

    url = f"{TIBIA_CHARACTER_URL}{character_name.replace(' ', '+')}&nocache={int(time.time())}"
    response = session.get(url)

    if response.status_code != 200:
        print("❌ Error al obtener la página del personaje.")
        return None

    soup = BeautifulSoup(response.text, "html.parser")

    # Buscar la sección de Character Deaths
    deaths_section = soup.find("div", class_="Text", string="Character Deaths")

    if deaths_section:
        deaths_table = deaths_section.find_parent("div", class_="CaptionInnerContainer").find_next("table")
        deaths = deaths_table.find_all("tr") if deaths_table else []

        # Extraer solo las muertes con fecha y descripción
        new_deaths = [
            (row.find_all("td")[0].text.strip(), row.find_all("td")[1].text.strip()) 
            for row in deaths if len(row.find_all("td")) == 2
        ]

        # Primera vez: mostrar lista completa
        if last_deaths is None:
            last_deaths = new_deaths
            if new_deaths:
                print("\n💀 Lista de muertes inicial:")
                for date, description in new_deaths:
                    print(f"🕒 {date} - {description}")
            else:
                print("✅ No hay muertes registradas.")

        # Si la lista de muertes creció, imprimir solo la nueva muerte
        elif len(new_deaths) > len(last_deaths):
            added_deaths = new_deaths[:len(new_deaths) - len(last_deaths)]
            print("\n⚠️ ¡Nueva muerte detectada! ⚠️")
            for date, description in added_deaths:
                print(f"🆕 {date} - {description}")

            # Esperar input del usuario antes de continuar
            input("🔄 Presiona ENTER para continuar el monitoreo...")

            # Actualizar la lista de muertes almacenada
            last_deaths = new_deaths

    else:
        print("✅ No hay muertes registradas.")

def monitor_character(character_name, interval=1):
    """Monitorea los cambios en la lista de muertes."""
    print(f"\n🔍 Monitoreando las muertes de: {character_name}...")

    while True:
        get_character_deaths(character_name)
        print(f"⏳ Verificando nuevamente en {interval} segundos...")
        time.sleep(interval)

if __name__ == "__main__":
    character_name = input("Ingrese el nombre del personaje: ")
    monitor_character(character_name, interval=1)  # Monitorea cada 30 segundos
