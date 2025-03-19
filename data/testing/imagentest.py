import cv2
import os

# Rutas de entrada y salida
carpeta_imagenes = r"C:\Users\Andres\Desktop\portafolio\backup\wiki\assets\icons\mapper\floors"
carpeta_salida = r"C:\Users\Andres\Desktop\portafolio\backup\wiki\assets\icons\mapper\floors\escaladas\x2"

# Asegurar que la carpeta de salida existe
os.makedirs(carpeta_salida, exist_ok=True)

factor = 4  # Factor de escalado

for i in range(16):  # Desde floor-00-map hasta floor-15-map
    nombre_imagen = f"floor-{i:02d}-map.png"  # floor-00-map.png, floor-01-map.png, etc.
    ruta_imagen = os.path.join(carpeta_imagenes, nombre_imagen)
    
    if not os.path.exists(ruta_imagen):
        print(f"❌ No se encontró: {nombre_imagen}")
        continue  # Saltar a la siguiente imagen si no existe

    # Cargar la imagen
    imagen = cv2.imread(ruta_imagen, cv2.IMREAD_UNCHANGED)

    if imagen is None:
        print(f"⚠️ No se pudo cargar: {nombre_imagen}. Puede estar dañada o en un formato no soportado.")
        continue

    # Escalar la imagen (manteniendo píxeles)
    nueva_dim = (imagen.shape[1] * factor, imagen.shape[0] * factor)
    imagen_escalada = cv2.resize(imagen, nueva_dim, interpolation=cv2.INTER_NEAREST)

    # Guardar la imagen con compresión PNG
    ruta_guardado = os.path.join(carpeta_salida, nombre_imagen)
    cv2.imwrite(ruta_guardado, imagen_escalada, [cv2.IMWRITE_PNG_COMPRESSION, 9])

    # Mostrar estadísticas de tamaño antes y después
    tam_original = os.path.getsize(ruta_imagen) / 1024  # KB
    tam_nuevo = os.path.getsize(ruta_guardado) / 1024  # KB
    reduccion = ((tam_original - tam_nuevo) / tam_original) * 100 if tam_original > 0 else 0

    print(f"✅ {nombre_imagen} escalada y comprimida")
    print(f"   🔹 Tamaño original: {tam_original:.2f} KB")
    print(f"   🔹 Tamaño comprimido: {tam_nuevo:.2f} KB")
    print(f"   🔹 Reducción: {reduccion:.2f}%")

print("🎉 Proceso completado")
