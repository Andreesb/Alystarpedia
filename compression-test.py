from PIL import Image, ImageFile
import os
import sys
ImageFile.LOAD_TRUNCATED_IMAGES = True
Image.MAX_IMAGE_PIXELS = None

def divide_image(image_path, output_dir, parts=16):
    # Asumimos que parts es un cuadrado perfecto (4x4 para 16 partes)
    grid_cols = grid_rows = int(parts**0.5)
    with Image.open(image_path) as im:
        width, height = im.size
        tile_width = width // grid_cols
        tile_height = height // grid_rows
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        for row in range(grid_rows):
            for col in range(grid_cols):
                left = col * tile_width
                upper = row * tile_height
                right = left + tile_width
                lower = upper + tile_height
                tile = im.crop((left, upper, right, lower))
                tile_name = f'{base_name}-tile-{row}-{col}.png'
                tile_path = os.path.join(output_dir, tile_name)
                tile.save(tile_path)
                print(f'Saved {tile_path}')

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python divide_map.py input_directory output_directory")
        sys.exit(1)
    input_dir = sys.argv[1]
    output_dir = sys.argv[2]
    os.makedirs(output_dir, exist_ok=True)
    for file_name in os.listdir(input_dir):
        if file_name.lower().endswith((".png", ".jpg", ".jpeg")):
            image_path = os.path.join(input_dir, file_name)
            divide_image(image_path, output_dir)
