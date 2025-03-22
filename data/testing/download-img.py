import os
import requests

# Carpeta donde se guardarán las imágenes
carpeta_destino = "assets/icons/mapper/mapas base"
os.makedirs(carpeta_destino, exist_ok=True)

# URL base
base_url = "https://tibiamaps.github.io/tibia-map-data"

# Descargar las imágenes e invertir la numeración
for i in range(16):
    # Nombre original y nombre invertido
    nombre_original = f"floor-{i:02d}-map.png"
    nombre_guardado = f"floor-{15 - i:02d}-map.png"

    # URL de la imagen
    url = f"{base_url}/{nombre_original}"
    ruta_destino = os.path.join(carpeta_destino, nombre_guardado)

    print(f"🔄 Descargando {url} como {nombre_guardado}...")

    # Descargar la imagen
    response = requests.get(url, stream=True)

    if response.status_code == 200:
        with open(ruta_destino, "wb") as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)
        print(f"✅ Guardado: {ruta_destino}")
    else:
        print(f"❌ Error al descargar {url}")

print("\n🚀 ¡Descarga completada!")
