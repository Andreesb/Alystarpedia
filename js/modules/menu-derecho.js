import { showActiveImage, startAutoRotate } from "./galeria.js";
import { showMaintenancePage } from "./mantenimiento.js";

export function showMenuDerecho() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    const menuContenedor = document.querySelector('.contenedor-derecho');
    const basePath = isIndex
        ? "html/menu-derecho.html"
        : "./menu-derecho.html";

        fetch(basePath)
        .then(response => response.text())
        .then(data => {
            menuContenedor.innerHTML = data;
            // Aquí ya existe el input
            const searchInput = document.getElementById("search-input");
            const resultsContainer = document.getElementById("search-results");
            
            // Aseguramos que esté oculto al inicio
            
            if (searchInput) {
                // Al enfocar, se evalúa el contenido actual del input
                searchInput.addEventListener("focus", function () {
                    const currentVal = searchInput.value;
                    const favorites = getFavorites();
                    const recent = getRecentSearches();
                    // Solo se muestra si hay algo que mostrar
                    if (currentVal.trim() !== "" || favorites.length > 0 || recent.length > 0) {
                        showSearchResults(currentVal);
                        resultsContainer.style.display = "block";
                    }
                });
                // Al escribir, se actualiza la búsqueda (con debounce)
                searchInput.addEventListener("input", debounce(function () {
                    showSearchResults(this.value);
                }, 300));
            }
            
            // Ocultar resultados solo si se hace clic fuera del input y del contenedor
            document.addEventListener("click", function (e) {
                if (
                    searchInput &&
                    !searchInput.contains(e.target) &&
                    !resultsContainer.contains(e.target)
                ) {
                    resultsContainer.style.display = "none";
                }
            });

            document.getElementById("party-share").addEventListener("input", function () {
                if (this.value.length > 4) {
                    this.value = this.value.slice(0, 4);
                }
            });

            // Resto de la inicialización
            showExp();
            startAutoRotate();
            menuExpand();
            showActiveImage();

            // Configurar eventos en enlaces
            const links = menuContenedor.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href');

                if (!href || href.trim() === "" || href === "#") {
                    link.addEventListener("click", (event) => {
                        event.preventDefault();
                        showMaintenancePage();
                    });
                } else if (isIndex && href.startsWith("./")) {
                    link.setAttribute('href', href.replace("./", "html/"));
                } else if (!isIndex && href.startsWith("html/")) {
                    link.setAttribute('href', href.replace("html/", "./"));
                }
            });
        })
        .catch(error => console.error('Error cargando el menú derecho:', error));
}

export function menuExpand(){
    document.querySelector('.lupa').addEventListener('click', function () {
        const search = document.querySelector('.search');
        search.classList.toggle('active');
        const searchContainer = document.querySelector('.search-Bar');
        searchContainer.classList.toggle('active');
    });

    const menuDinamicoItems = document.querySelectorAll('.menu-dinamico ul');

    menuDinamicoItems.forEach((item, index) => {
      // Evento 'click' en cada <ul>
        item.addEventListener('click', () => {
            console.log(`Se hizo clic en el elemento ${index + 1}`);
        
            // Buscar la sección hija
            const section = item.querySelector('section');
            if (section) {
            console.log('Se encontró una sección:', section);
        
            // Alternar la clase 'expandido'
            section.classList.toggle('expandido');
            console.log('Clase aplicada:', section.classList);
        
            // Cerrar otras secciones
            menuDinamicoItems.forEach((otherItem, otherIndex) => {
                if (otherItem !== item) {
                const otherSection = otherItem.querySelector('section');
                if (otherSection) {
                    otherSection.classList.remove('expandido');
                    console.log(`Se cerró la sección del elemento ${otherIndex + 1}`);
                }
                }
            });
            } else {
            console.log('No se encontró ninguna sección en este <ul>.');
            }
        });
    });

    // Evitar que se cierre la sección al hacer clic dentro de ella
    document.querySelectorAll(".menu-dinamico section").forEach(section => {
        section.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    });

}
export function calculateExp(level) {
    const shareExpMin = Math.floor((level * 2) / 3);
    const shareExpMax = Math.floor((level * 3) / 2);

    return { min: shareExpMin, max: shareExpMax };
}

export function showExp() {
    document.querySelectorAll(".party-share").forEach(input => {
        input.addEventListener("input", function () {
            const level = parseInt(this.value, 10);
            const tooltip = document.getElementById("tooltip");
            const miniTooltip = document.getElementById("mini-tooltip");
            let maxLevel = 3000;

            // Caso: Nivel mayor o igual a maxLevel (mensaje gracioso)
            if (!isNaN(level) && level >= maxLevel) {
                tooltip.textContent = `Whoa, slow down! \n Please enter a real level.`;
                tooltip.style.visibility = "visible";
                tooltip.style.height = "auto";
                tooltip.style.opacity = "1";
                miniTooltip.textContent = `Whoa, slow down!\n Please enter a real level.`;
                miniTooltip.style.visibility = "visible";
                miniTooltip.style.opacity = "1";
                
            }
            // Caso: Nivel inválido (menor o igual a 0)
            else if (!isNaN(level) && level <= 0) {
                tooltip.textContent = `Please enter a valid level.`;
                tooltip.style.visibility = "visible";
                tooltip.style.opacity = "1";
                miniTooltip.textContent = `Please enter a valid level.`;
                miniTooltip.style.visibility = "visible";
                miniTooltip.style.opacity = "1";
            }
            // Caso: Nivel válido y mayor a 0
            else if (!isNaN(level) && level > 0) {
                const { min, max } = calculateExp(level);
                tooltip.textContent = `You can share exp between \n level's ${min} and ${max}.`;
                tooltip.style.visibility = "visible";
                tooltip.style.opacity = "1";
                miniTooltip.textContent = `You can share exp \n between \n level's ${min} and ${max}.`;
                miniTooltip.style.visibility = "visible";
                miniTooltip.style.opacity = "1";
            } else {
                tooltip.style.opacity = "0";
                tooltip.style.visibility = "hidden";
            }
        });
    });
}


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

  /* --- CARGA DEL ARCHIVO JSON CON LOS DATOS DEL MENÚ --- */
async function loadMenuData() {
    const response = await fetch("../data/database/data/data.json");
    const menuData = await response.json();
    console.log("Se consiguieron los datos:", menuData.menu);
    return menuData.menu;
}

  /* --- BÚSQUEDA CON PUNTUACIÓN DE RELEVANCIA --- */
function searchMenu(query, menuItems) {
    query = normalizeText(query.trim());
    if (!query) return [];
    return menuItems
    .map(item => {
        let score = 0;
        if (matchesQuery(item.title, query)) score += 3;
        if (item.keywords.some(keyword => matchesQuery(keyword, query))) score += 2;
        if (matchesQuery(item.category, query)) score += 1;
        // Agregar el valor de prioridad (si existe) a la puntuación
        const priority = item.priority || 0;
        score += priority; // Puedes ajustar el factor de influencia según lo necesites
        return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

  /* --- GESTIÓN DE FAVORITOS Y RECENTES EN LOCAL STORAGE --- */
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}
function setFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}
function getRecentSearches() {
    return JSON.parse(localStorage.getItem("recentSearches")) || [];
}
function setRecentSearches(recent) {
    localStorage.setItem("recentSearches", JSON.stringify(recent));
}
function addRecentSearch(item) {
    let recent = getRecentSearches();
    // Eliminar duplicados: si ya está en recientes, quitarlo
    recent = recent.filter(search => search.url !== item.url);
    recent.unshift(item);
    if (recent.length > 4) recent.pop();
    setRecentSearches(recent);
}

  /* --- REMOVER UN ELEMENTO DE LOS RECENTS --- */
function removeRecent(item) {
    let recent = getRecentSearches();
    recent = recent.filter(search => search.url !== item.url);
    setRecentSearches(recent);
    // Actualiza la vista usando el valor actual del input
    const searchInput = document.getElementById("search-input");
    showSearchResults(searchInput.value);
}

  /* --- GESTIÓN DE FAVORITOS CON LÍMITE MÁXIMO DE 4 --- */
function toggleFavorite(item, button) {
    let favorites = getFavorites();
    const exists = favorites.find(fav => fav.url === item.url);
    if (exists) {
        favorites = favorites.filter(fav => fav.url !== item.url);
        setFavorites(favorites);
    } else {
    if (favorites.length >= 4) {
        // Si ya hay 4 favoritos, animar la estrella y mostrar tooltip "Max 4"
        button.classList.add("vibrate");
        button.setAttribute("data-tooltip", "Max 4");
        setTimeout(() => {
            button.classList.remove("vibrate");
            button.removeAttribute("data-tooltip");
        }, 1000);
        return;
    } else {
        favorites.push(item);
        setFavorites(favorites);
    }
    }
    // Actualizar la vista de resultados sin ocultar la lista
    const searchInput = document.getElementById("search-input");
    showSearchResults(searchInput.value);
}

    /* --- CREACIÓN DE UN ELEMENTO RESULTADO CON BOTONES --- */
    /* Parámetros:
    - item: objeto de datos.
    - isFavorite: true si es favorito.
    - isRecent: true si es un item de recent (para mostrar botón remove).
  */
    function createResultItem(item, isFavorite, isRecent = false) {
        const resultElement = document.createElement("div");
        resultElement.classList.add("search-result");
    
        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = `${item.title}`;
        // Si el objeto tiene target "_blank", se lo asignamos
        if (item.target && item.target === "_blank") {
            link.setAttribute("target", "_blank");
        }
        link.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            addRecentSearch(item);
            // Redirigir: si target es _blank, abrimos en nueva pestaña
            if (item.target && item.target === "_blank") {
                window.open(item.url, "_blank");
            } else {
                window.location.href = item.url;
            }
        };
    
        const btnContainer = document.createElement("div");
        btnContainer.style.display = "flex";
        btnContainer.style.gap = "5px";
    
        const favButton = document.createElement("button");
        favButton.textContent = isFavorite ? "★" : "☆";
        favButton.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleFavorite(item, favButton);
        };
    
        btnContainer.appendChild(favButton);
    
        // Si es un item de recents, agregar botón para eliminarlo
        if (isRecent) {
            const removeButton = document.createElement("button");
            removeButton.textContent = "✕";
            removeButton.style.fontSize = "10px";
            removeButton.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                removeRecent(item);
            };
            btnContainer.appendChild(removeButton);
        }
    
        resultElement.appendChild(link);
        resultElement.appendChild(btnContainer);
        return resultElement;
    }
    

  /* --- MOSTRAR RESULTADOS, FAVORITOS Y RECENTES --- */
export async function showSearchResults(query = "") {
    const menuItems = await loadMenuData();
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = "";

    const favorites = getFavorites();
    // Para recents: se muestran todos los items de recents que NO estén en favorites
    let recent = getRecentSearches().filter(item => !favorites.some(fav => fav.url === item.url));

    const searchResults = query ? searchMenu(query, menuItems) : [];
    console.log("Favorites:", favorites);
    console.log("Recents:", recent);

    // Mostrar contenedor solo si hay contenido a mostrar
    if (!query && favorites.length === 0 && recent.length === 0) {
        resultsContainer.style.display = "none";
        return;
    } else {
        resultsContainer.style.display = "block";
    }

    if (!query) {
        if (favorites.length > 0) {
            const favTitle = document.createElement("h6");
            favTitle.textContent = "Fav";
            resultsContainer.appendChild(favTitle);
            favorites.forEach(item => {
            resultsContainer.appendChild(createResultItem(item, true, false));
        });
    }
    if (recent.length > 0) {
        const recentTitle = document.createElement("h6");
        recentTitle.textContent = "Recents";
        resultsContainer.appendChild(recentTitle);
        recent.forEach(item => {
            resultsContainer.appendChild(createResultItem(item, false, true));
        });
    }
    } else {
        if (searchResults.length > 0) {
            const resultTitle = document.createElement("h6");
            resultTitle.textContent = "Results";
            resultsContainer.appendChild(resultTitle);
            searchResults.forEach(item => {
                resultsContainer.appendChild(createResultItem(item, favorites.some(fav => fav.url === item.url), false));
            });
    } else {
        resultsContainer.innerHTML = "<p>No found results.</p>";
    }
    }
}
