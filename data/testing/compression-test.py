import os
import cv2

# Directorios
carpeta_entrada = "assets\icons\mapper\escaladas"
carpeta_salida = "assets\icons\mapper\comprimidas"
os.makedirs(carpeta_salida, exist_ok=True)

calidad = 90  # Ajustar entre 80-100

# Procesar todas las imágenes en la carpeta de entrada
for archivo in os.listdir(carpeta_entrada):
    if archivo.endswith(".png"):
        ruta_entrada = os.path.join(carpeta_entrada, archivo)
        ruta_salida = os.path.join(carpeta_salida, archivo.replace(".png", ".webp"))

        print(f"📦 Procesando {archivo}...")

        # Cargar imagen y verificar
        imagen = cv2.imread(ruta_entrada, cv2.IMREAD_UNCHANGED)
        if imagen is None:
            print(f"❌ Error al abrir {ruta_entrada}. Saltando...")
            continue  # Salta a la siguiente imagen

        # Guardar en formato WebP comprimido
        try:
            cv2.imwrite(ruta_salida, imagen, [cv2.IMWRITE_WEBP_QUALITY, calidad])
            print(f"✅ Guardado: {ruta_salida}")
        except Exception as e:
            print(f"❌ Error guardando {ruta_salida}: {e}")

print("\n🚀 ¡Compresión completada!")
