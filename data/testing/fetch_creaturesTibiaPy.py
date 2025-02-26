import asyncio
import tibiapy

async def test_fetch_creature():
    client = tibiapy.Client()
    creature_name = "dragon"  # Cambia esto por el nombre de la criatura que quieras probar

    response = await client.fetch_creature(creature_name)

    if response.data:
        print(f"✅ Datos de {response.data.name}:")
        print(f"Descripción: {response.data.description}")
        print(f"HP: {response.data.hitpoints}, EXP: {response.data.experience}")
        print(f"Inmune a: {', '.join(response.data.immune_to)}")
        print(f"Débil contra: {', '.join(response.data.weak_against)}")
        print(f"Loot: {response.data.loot}")
        print(f"Imagen: {response.data.image_url}")
        print(f"URL: {response.data.url}")
    else:
        print("❌ No se encontró información para esa criatura.")

# Ejecutar la función de prueba
asyncio.run(test_fetch_creature())
