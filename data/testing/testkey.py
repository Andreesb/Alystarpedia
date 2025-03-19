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
    """Permite editar, agregar o eliminar cualquier atributo de una llave en Keys.json."""
    keys_data = load_keys()
    
    while True:
        print("\n🔑 Lista de llaves disponibles:")
        for item in keys_data:
            print(f"- {item.get('name', 'Desconocido')}")
        
        key_name = input("\n¿Qué llave quieres editar? (Escribe el nombre exacto o 'salir'): ").strip()
        if key_name.lower() == "salir":
            print("👋 Saliendo del editor de llaves...")
            break
        
        item_data = find_key(keys_data, key_name)
        if not item_data:
            print("❌ Llave no encontrada. Intenta nuevamente.")
            continue

        while True:
            print("\n📌 Atributos actuales:")
            for key, value in item_data.items():
                print(f"  {key}: {value}")

            attribute = input("\n¿Qué atributo quieres modificar? (Escribe el nombre exacto o 'salir'): ").strip()
            if attribute.lower() == "salir":
                break

            # Si el atributo no existe, preguntar si quiere crearlo
            if attribute not in item_data:
                create_attr = input(f"El atributo '{attribute}' no existe. ¿Deseas crearlo? (sí/no): ").strip().lower()
                if create_attr not in ["sí", "si"]:
                    print("❌ Atributo no creado.")
                    continue
            
            # Manejo especial de 'location'
            if attribute == "location":
                if "location" not in item_data or not isinstance(item_data["location"], dict):
                    item_data["location"] = {"find": "", "use": []}

                find_location = input(f"🔍 Nueva ubicación FIND (actual: {item_data['location'].get('find', 'No definida')}): ").strip()
                if find_location:
                    item_data["location"]["find"] = find_location
                
                use_locations = item_data["location"].get("use", [])
                print("\n🚪 Ubicaciones USE actuales:")
                for i, loc in enumerate(use_locations, start=1):
                    print(f"  {i}. {loc}")

                while True:
                    update_option = input("¿Agregar, modificar o eliminar una ubicación USE? (agregar/modificar/eliminar/no): ").strip().lower()
                    if update_option == "agregar":
                        new_use = input("Ingrese la nueva ubicación USE: ").strip()
                        if new_use:
                            use_locations.append(new_use)
                    elif update_option == "modificar" and use_locations:
                        index = int(input("Ingrese el número de la ubicación USE a modificar: ")) - 1
                        if 0 <= index < len(use_locations):
                            new_use = input(f"Nuevo valor para {use_locations[index]}: ").strip()
                            use_locations[index] = new_use
                    elif update_option == "eliminar" and use_locations:
                        index = int(input("Ingrese el número de la ubicación USE a eliminar: ")) - 1
                        if 0 <= index < len(use_locations):
                            del use_locations[index]
                    elif update_option == "no":
                        break
                    else:
                        print("❌ Opción inválida.")

                item_data["location"]["use"] = use_locations

            # Manejo especial de 'keywords'
            elif attribute == "keywords":
                if "keywords" not in item_data:
                    item_data["keywords"] = []

                print("\n🔑 Palabras clave actuales:")
                for i, keyword in enumerate(item_data["keywords"], start=1):
                    print(f"  {i}. {keyword}")

                while True:
                    keyword_option = input("¿Agregar, modificar o eliminar una palabra clave? (agregar/modificar/eliminar/no): ").strip().lower()
                    if keyword_option == "agregar":
                        new_keyword = input("Ingrese la nueva palabra clave: ").strip()
                        if new_keyword:
                            item_data["keywords"].append(new_keyword)
                    elif keyword_option == "modificar" and item_data["keywords"]:
                        index = int(input("Ingrese el número de la palabra clave a modificar: ")) - 1
                        if 0 <= index < len(item_data["keywords"]):
                            new_keyword = input(f"Nuevo valor para {item_data['keywords'][index]}: ").strip()
                            item_data["keywords"][index] = new_keyword
                    elif keyword_option == "eliminar" and item_data["keywords"]:
                        index = int(input("Ingrese el número de la palabra clave a eliminar: ")) - 1
                        if 0 <= index < len(item_data["keywords"]):
                            del item_data["keywords"][index]
                    elif keyword_option == "no":
                        break
                    else:
                        print("❌ Opción inválida.")

            # Modificación genérica de otros atributos
            else:
                new_value = input(f"Ingrese el nuevo valor para '{attribute}' (o 'eliminar' para borrarlo): ").strip()
                if new_value.lower() == "eliminar":
                    confirm_delete = input(f"¿Seguro que quieres eliminar '{attribute}'? (sí/no): ").strip().lower()
                    if confirm_delete in ["sí", "si"]:
                        del item_data[attribute]
                        print(f"✅ Atributo '{attribute}' eliminado.")
                else:
                    item_data[attribute] = new_value

            save_keys(keys_data)

        edit_another = input("¿Quieres editar otra llave? (sí/no): ").strip().lower()
        if edit_another not in ["sí", "si"]:
            print("👋 Saliendo del editor de llaves...")
            break

# Ejecutar la función
edit_key()
