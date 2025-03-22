import os
import sys
from PIL import Image


Image.MAX_IMAGE_PIXELS = None

def split_image(image_path, output_folder, tile_size=256):
    """
    Divide la imagen en tiles de tamaño tile_size x tile_size y los guarda en output_folder.
    """
    try:
        img = Image.open(image_path)
    except Exception as e:
        print(f"Error abriendo {image_path}: {e}")
        return

    img_width, img_height = img.size
    base_name = os.path.splitext(os.path.basename(image_path))[0]

    # Calcular número de columnas y filas
    cols = (img_width + tile_size - 1) // tile_size
    rows = (img_height + tile_size - 1) // tile_size

    # Asegurarse que la carpeta de salida existe
    os.makedirs(output_folder, exist_ok=True)

    for row in range(rows):
        for col in range(cols):
            left = col * tile_size
            upper = row * tile_size
            right = min((col + 1) * tile_size, img_width)
            lower = min((row + 1) * tile_size, img_height)

            # Recortar el tile
            tile = img.crop((left, upper, right, lower))
            tile_filename = f"{base_name}-tile-{row}-{col}.png"
            tile_path = os.path.join(output_folder, tile_filename)
            tile.save(tile_path)
            print(f"Guardado {tile_path}")

def process_folder(input_folder, output_folder, tile_size=256):
    """
    Procesa todas las imágenes en input_folder y las divide en tiles,
    guardándolos en output_folder.
    """
    for file in os.listdir(input_folder):
        if file.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
            image_path = os.path.join(input_folder, file)
            print(f"Procesando {image_path}...")
            split_image(image_path, output_folder, tile_size)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python divide_imagenes.py <carpeta_entrada> <carpeta_salida> [tamaño_tile]")
        sys.exit(1)

    input_folder = sys.argv[1]
    output_folder = sys.argv[2]
    tile_size = int(sys.argv[3]) if len(sys.argv) > 3 else 256

    process_folder(input_folder, output_folder, tile_size)
