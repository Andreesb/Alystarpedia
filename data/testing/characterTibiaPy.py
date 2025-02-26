import asyncio
import time
from tibiapy import Client

async def fetch_character(character_name):
    """Obtiene la información de un personaje de Tibia.com."""
    client = Client()  # Crear la instancia manualmente
    try:
        response = await client.fetch_character(character_name)
        return response.data  # Devuelve el objeto Character si existe
    except Exception as e:
        print(f"❌ Error al obtener datos: {e}")
        return None

async def monitor_character(character_name):
    """Monitorea los cambios en la información de muertes del personaje."""
    character = await fetch_character(character_name)
    
    if not character:
        print("❌ No se encontró el personaje.")
        return
    
    initial_deaths = character.deaths  # Guardamos el estado inicial de muertes
    print(f"✅ Datos iniciales de {character.name}:")
    print(f"Nivel: {character.level}")
    print(f"Muertes registradas: {len(character.deaths)}")

    input("Presiona Enter para iniciar la monitorización...")

    start_time = time.time()
    
    while True:
        character = await fetch_character(character_name)
        print(f"deaths: {len(character.deaths)}")
        
        if not character:
            print("❌ Error al obtener la información actualizada.")
            continue
        
        if character.deaths != initial_deaths:
            elapsed_time = time.time() - start_time
            print(f"⚠️ ¡Cambio detectado! La lista de muertes ha cambiado después de {elapsed_time:.2f} segundos.")
            break  # Detiene el monitoreo

if __name__ == "__main__":
    character_name = input("Ingresa el nombre del personaje: ")
    asyncio.run(monitor_character(character_name))
