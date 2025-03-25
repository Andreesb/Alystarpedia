import cv2
import os

# Ruta de la imagen original
ruta_imagen = r"C:\Users\Andres\Desktop\portafolio\backup\wiki\assets\media\TibiaFankit\TibiaFankit\Wallpapers\Wallpapers_ClientArtwork2017\Wallpaper_ClientArtworkWinter2017_1920x1080.jpg"

# Carpeta de salida
carpeta_salida = r"C:\Users\Andres\Desktop\portafolio\backup\wiki\assets\media\wallpapersEscalados"
os.makedirs(carpeta_salida, exist_ok=True)

# Factor de escalado
factor = 4

# Cargar la imagen
imagen = cv2.imread(ruta_imagen, cv2.IMREAD_UNCHANGED)
if imagen is None:
    print("⚠️ No se pudo cargar la imagen.")
else:
    # Calcular dimensiones nuevas
    nueva_dim = (imagen.shape[1] * factor, imagen.shape[0] * factor)

    # Escalar la imagen usando INTER_CUBIC (o INTER_LINEAR)
    imagen_escalada = cv2.resize(imagen, nueva_dim, interpolation=cv2.INTER_CUBIC)

    # Guardar la imagen escalada
    nombre_archivo = os.path.basename(ruta_imagen)
    ruta_guardado = os.path.join(carpeta_salida, nombre_archivo)
    cv2.imwrite(ruta_guardado, imagen_escalada)

    # Mostrar estadísticas de tamaño (opcional)
    tam_original = os.path.getsize(ruta_imagen) / 1024  # en KB
    tam_nuevo = os.path.getsize(ruta_guardado) / 1024  # en KB
    reduccion = ((tam_original - tam_nuevo) / tam_original * 100) if tam_original > 0 else 0

    print(f"✅ {nombre_archivo} escalada y guardada")
    print(f"   🔹 Tamaño original: {tam_original:.2f} KB")
    print(f"   🔹 Tamaño escalado: {tam_nuevo:.2f} KB")
    print(f"   🔹 Diferencia: {reduccion:.2f}%")

print("🎉 Proceso completado")
