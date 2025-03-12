import json

def clean_notes(file_path):
    # Leer el archivo JSON
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    # Recorrer cada objeto y limpiar el campo notes si es necesario
    for item in data:
        if "notes" in item and item["notes"].startswith("Notes\n"):
            item["notes"] = item["notes"][6:]  # Remover "Notes\n"

        # Eliminar dropped_by si está vacío
        if "dropped_by" in item and not item["dropped_by"]:
            del item["dropped_by"]
    
    # Guardar los cambios en el archivo JSON
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

# Ruta del archivo JSON
file_path = "data/database/data/useful/Keys.json"
clean_notes(file_path)
print("Archivo actualizado correctamente.")

