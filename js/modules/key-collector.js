import { hideLoader, showLoader } from "../modules/loader.js";

document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("key-search");
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
    /* --- DEBOUNCE PARA EVITAR BÚSQUEDAS INNECESARIAS --- */
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /* --- NORMALIZACIÓN DE TEXTO (quita acentos y pone en minúsculas) --- */
    function normalizeText(text) {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    /* --- COMPROBACIÓN DE COINCIDENCIAS DE LAS PALABRAS (en cualquier orden) --- */
    function matchesQuery(text, query) {
        const words = query.split(" ").filter(w => w);
        return words.every(word => normalizeText(text).includes(normalizeText(word)));
    }


    // Función de búsqueda con mejoras
    function searchKeys() {
        const query = normalizeText(searchInput.value.trim());
        const selectedClasses = Array.from(document.querySelectorAll(".filter-class:checked")).map(cb => cb.value);
        const questFilter = document.getElementById("filter-quest").checked;

        if (query === "" && selectedClasses.length === 0 && !questFilter) {
            resultsList.style.display = "none";
            keyDetails.style.display = "none";
            showLoader();
            return;
        }

        showLoader(); // Mostrar loader

        clearTimeout(typingTimer); // Reiniciar temporizador
        typingTimer = setTimeout(() => {
            resultsList.innerHTML = "";
            keyDetails.style.display = "none"; // Ocultar detalles al cambiar búsqueda

            const filteredKeys = keysData.filter(key => {
                const nameMatch = matchesQuery(key.name, query);
                const keywordMatch = key.keywords?.some(keyword => matchesQuery(keyword, query));
                const classMatch = selectedClasses.length === 0 || selectedClasses.includes(key.attributes["Item Class"]);

                // Verificar si el ítem está relacionado con una quest
                const questMatch = !questFilter || (Array.isArray(key.quest) && key.quest.length > 0) || (key.notes && key.notes.toLowerCase().includes("quest"));

                return (nameMatch || keywordMatch) && classMatch && questMatch;
            });

            hideLoader(); // Ocultar loader después de la búsqueda

            if (filteredKeys.length === 0) {
                resultsList.innerHTML = `<p class="no-results">Wrong words.</p>`;
                resultsList.style.display = "block";
                return;
            }

            resultsList.style.display = "flex"; // Mostrar lista si hay resultados

            filteredKeys.forEach(key => {
                const listItem = document.createElement("li");
                listItem.classList.add("key-item");

                const img = document.createElement("img");
                img.src = key.image_url;
                img.alt = key.name;
                img.classList.add("key-icon");

                const nameSpan = document.createElement("span");
                nameSpan.textContent = key.name;

                listItem.appendChild(img);
                listItem.appendChild(nameSpan);

                listItem.addEventListener("click", () => displayKeyDetails(key));

                resultsList.appendChild(listItem);
            });
        }, 300); // Se reduce el debounce a 300ms para mayor rapidez
    }


    // Aplicar debounce a la función de búsqueda
    const debouncedSearchKeys = debounce(searchKeys, 300);

    // Evento de entrada en el campo de búsqueda
    searchInput.addEventListener("input", debouncedSearchKeys);


    // Mostrar detalles de la llave
    function displayKeyDetails(key) {
        document.getElementById("key-name").textContent = key.name;
        document.getElementById("key-image").src = key.image_url;
        document.getElementById("key-image").alt = key.name; // Alternativo si la imagen no carga
        document.getElementById("key-class").textContent = key.attributes["Item Class"];
        document.getElementById("key-notes").textContent = key.notes;
        document.getElementById("key-quest").textContent = key.quest || "No";
        document.getElementById("key-buy").textContent = Array.isArray(key.buyfrom) ? key.buyfrom.join(", ") : "Cannot be bought";

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
                useIframe.title = `${index + 1}`; // Agregar título al iframe
                useItContainer.appendChild(useIframe);
            });
        }

        // Agregar contenedor Use it al contenedor principal
        locationsContainer.appendChild(useItContainer);
        

        

        // Mostrar la sección de detalles
        document.getElementById("key-details").style.display = "block";

    }

    // Mostrar loader al limpiar el input
    searchInput.addEventListener("input", () => {
        if (searchInput.value.trim() === "") {
            showLoader();
        }
    });
    checkboxes.forEach(filter => {
        filter.addEventListener("change", () => {
            // Deshabilita el checkbox por 500ms para evitar cambios rápidos
            filter.disabled = true;
            setTimeout(() => {
                filter.disabled = false;
            }, 500);
    
            searchKeys();
        });
    });
    

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

