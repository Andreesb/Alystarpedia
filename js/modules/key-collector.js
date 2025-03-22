import { hideLoader, showLoader } from "../modules/loader.js";

document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("search-input");
    const resultsList = document.getElementById("results");
    const keyDetails = document.getElementById("key-details");
    const checkboxes = document.querySelectorAll(".filter-class, #filter-quest");

    let keysData = [];
    let typingTimer;
    const typingDelay = 500; // 1 segundo de espera después de la última entrada

    // Cargar JSON
    async function loadKeys() {
        try {
            const response = await fetch("../data/database/data/useful/Keys.json");
            keysData = await response.json();
        } catch (error) {
            console.error("Error cargando Keys.json", error);
        }
    }

    await loadKeys();

    // Función de búsqueda con loader
    function searchKeys() {
        const query = searchInput.value.toLowerCase().trim();
        const selectedClasses = Array.from(document.querySelectorAll(".filter-class:checked")).map(cb => cb.value);
        const questFilter = document.getElementById("filter-quest").checked;

        // Si los campos están vacíos, no mostramos el loader
        if (query === "" && selectedClasses.length === 0 && !questFilter) {
            resultsList.style.display = "none";
            keyDetails.style.display = "none";
            hideLoader();
            return;
        }

        showLoader(); // Mostrar loader

        clearTimeout(typingTimer); // Reiniciar temporizador
        typingTimer = setTimeout(() => {
            resultsList.innerHTML = "";
            keyDetails.style.display = "none"; // Ocultar detalles al cambiar búsqueda

            const filteredKeys = keysData.filter(key => {
                const nameMatch = key.name.toLowerCase().includes(query);
                const keywordMatch = key.keywords?.some(keyword => keyword.toLowerCase().includes(query));
                const classMatch = selectedClasses.length === 0 || selectedClasses.includes(key.attributes["Item Class"]);
                const questMatch = !questFilter || key.notes.toLowerCase().includes("quest");

                return (nameMatch || keywordMatch) && classMatch && questMatch;
            });

            hideLoader(); // Ocultar loader después de 1 segundo

            if (filteredKeys.length === 0) {
                resultsList.style.display = "none";
                return;
            }

            resultsList.style.display = "flex"; // Mostrar lista si hay resultados

            filteredKeys.forEach(key => {
                const listItem = document.createElement("li");
                listItem.classList.add("key-item"); // Clase para CSS

                // Crear imagen
                const img = document.createElement("img");
                img.src = key.image_url;
                img.alt = key.name;
                img.classList.add("key-icon"); // Clase para CSS

                // Crear nombre de la llave
                const nameSpan = document.createElement("span");
                nameSpan.textContent = key.name;

                // Estructurar el item (imagen + texto)
                listItem.appendChild(img);
                listItem.appendChild(nameSpan);

                // Evento para mostrar detalles al hacer clic
                listItem.addEventListener("click", () => displayKeyDetails(key));

                // Agregar a la lista
                resultsList.appendChild(listItem);
            });
        }, typingDelay); // Espera 1 segundo después de la última tecla o selección
    }

    // Mostrar detalles de la llave
    function displayKeyDetails(key) {
        document.getElementById("key-name").textContent = key.name;
        document.getElementById("key-image").src = key.image_url;
        document.getElementById("key-image").alt = key.name; // Alternativo si la imagen no carga
        document.getElementById("key-class").textContent = key.attributes["Item Class"];
        document.getElementById("key-location").textContent = key.attributes.Origin || "Desconocido";
        document.getElementById("key-notes").textContent = key.notes;
        document.getElementById("key-quest").textContent = key.notes.includes("quest") ? "Sí" : "No";
        document.getElementById("key-buy").textContent = Array.isArray(key.buyfrom) ? key.buyfrom.join(", ") : "No se puede comprar";

        // Limpiar contenedor de ubicaciones
        // Limpiar contenedor de ubicaciones
        const locationsContainer = document.getElementById("locations");
        locationsContainer.innerHTML = "";

        // Crear contenedor Find it
        const findItContainer = document.createElement("div");
        findItContainer.id = "find-it";

        // Agregar título al contenedor Find it
        const findTitle = document.createElement("h3");
        findTitle.textContent = "Find it";
        findItContainer.appendChild(findTitle);

        // Agregar iframe Find it si existe
        if (key.location?.find) {
            const findIframe = document.createElement("iframe");
            findIframe.src = key.location.find;
            findIframe.style.width = "250px";
            findIframe.style.height = "200px";
            findIframe.style.border = "none";
            findIframe.style.padding = "10px"
            findIframe.title = "Mapa para encontrar la ubicación"; // Agregar título al iframe
            findItContainer.appendChild(findIframe);
        }

        // Agregar contenedor Find it al contenedor principal
        locationsContainer.appendChild(findItContainer);

        // Crear contenedor Use it
        const useItContainer = document.createElement("div");
        useItContainer.id = "use-it";

        // Agregar título al contenedor Use it
        const useTitle = document.createElement("h3");
        useTitle.textContent = "Use it";
        useItContainer.appendChild(useTitle);

        // Agregar iframes Use it si existen
        if (key.location?.use?.length > 0) {
            key.location.use.forEach((useUrl, index) => {
                const useIframe = document.createElement("iframe");
                useIframe.src = useUrl;
                useIframe.style.maxWidth = "250px";
                useIframe.style.maxHeight = "200px";
                useIframe.style.border = "none";
                useIframe.style.padding = "10px"
                useIframe.title = `Instrucciones de uso ${index + 1}`; // Agregar título al iframe
                useItContainer.appendChild(useIframe);
            });
        }

        // Agregar contenedor Use it al contenedor principal
        locationsContainer.appendChild(useItContainer);
        

        

        // Mostrar la sección de detalles
        document.getElementById("key-details").style.display = "block";

    }

    

    // Eventos de búsqueda y filtros
    searchInput.addEventListener("input", searchKeys);
    checkboxes.forEach(filter => filter.addEventListener("change", searchKeys));

    const words = ["Enter a key-word", "Asura", "Key 3500","Oberon", "Desert Quest", "Hellgate"]; // Palabras a rotar
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;
        
        function typeEffect() {
            const currentWord = words[wordIndex];
            const currentChars = currentWord.substring(0, charIndex);
        
            searchInput.setAttribute("placeholder", currentChars + "|"); // Cursor animado
        
            if (!deleting && charIndex < currentWord.length) {
                charIndex++;
                setTimeout(typeEffect, 100); // Velocidad de escritura
            } else if (deleting && charIndex > 0) {
                charIndex--;
                setTimeout(typeEffect, 50); // Velocidad de borrado
            } else {
                deleting = !deleting; // Cambia de escribir a borrar
                if (!deleting) {
                    wordIndex = (wordIndex + 1) % words.length; // Pasa a la siguiente palabra
                }
                setTimeout(typeEffect, 1000); // Pausa antes de cambiar palabra
            }
        }
        
        // Iniciar el efecto
        typeEffect();

        


        
});

