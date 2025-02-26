import json
import os

# Ruta del archivo JSON
file_path = os.path.join("data", "database", "data", "useful", "Keys.json")

def load_keys():
    """Carga el archivo Keys.json y devuelve los datos como una lista."""
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)
    return []

def save_keys(data):
    """Guarda los datos actualizados en Keys.json."""
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
    print("✅ Cambios guardados correctamente.")

def find_key(keys_data, key_name):
    """Busca una llave en la lista por su atributo 'name'."""
    for item in keys_data:
        if item.get("name") == key_name:
            return item
    return None

def edit_key():
    """Permite editar la ubicación de 'find' y 'use' en Keys.json."""
    keys_data = load_keys()

    while True:
        print("\n🔑 Lista de llaves disponibles:")
        for item in keys_data:
            print(f"- {item.get('name', 'Desconocido')}")

        key_name = input("\n¿Qué llave quieres editar? (Escribe el nombre exacto): ").strip()
        item_data = find_key(keys_data, key_name)
        if not item_data:
            print("❌ Llave no encontrada. Intenta nuevamente.")
            continue

        # Asegurar que location existe como diccionario
        if "location" not in item_data or not isinstance(item_data["location"], dict):
            item_data["location"] = {}

        # Agregar ubicación 'find'
        find_location = input(f"🔍 Ingrese la ubicación FIND para '{key_name}': ").strip()
        confirm_find = input(f"Confirme la ubicación FIND ({find_location}) (sí/no): ").strip().lower()
        if confirm_find in ["sí", "si"]:
            item_data["location"]["find"] = find_location
        else:
            print("❌ Ubicación FIND descartada.")

        # Agregar ubicaciones 'use'
        use_locations = []
        while True:
            use_location = input(f"🚪 Ingrese una ubicación USE para '{key_name}': ").strip()
            confirm_use = input(f"Confirme la ubicación USE ({use_location}) (sí/no): ").strip().lower()
            if confirm_use in ["sí", "si"]:
                use_locations.append(use_location)
                another_use = input("¿Deseas agregar otra ubicación USE? (sí/no): ").strip().lower()
                if another_use not in ["sí", "si"]:
                    break
            else:
                print("❌ Ubicación USE descartada.")

        if use_locations:
            item_data["location"]["use"] = use_locations

        save_keys(keys_data)

        edit_another = input("¿Quieres editar otra llave? (sí/no): ").strip().lower()
        if edit_another not in ["sí", "si"]:
            print("👋 Saliendo del editor de llaves...")
            break

edit_key()
