import { showMaintenancePage } from "./mantenimiento.js";
import { actualizarRashid } from "./rashid.js";


export function showMenuIzquierdo() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    const menuContenedor = document.querySelector('.contenedor-izquierdo');
    
    const basePath = isIndex
        ? "html/menu-izquierdo.html"
        : "./menu-izquierdo.html";

    fetch(basePath)
        .then(response => response.text())
        .then(data => {
            menuContenedor.innerHTML = data;
            actualizarRashid();
            fetchBoostedCreature();
            fetchBoostedBoss();

            // Procesar los enlaces después de cargar el menú
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
        .catch(error => console.error('Error cargando el menú izquierdo:', error));

}



const CACHE_DURATION = 2 * 60 * 60 * 1000;

async function fetchDataWithCache(url, cacheKey) {
    // Verificar si existe caché y no ha expirado
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        } catch (e) {
            console.error("Error al parsear la caché para", cacheKey, e);
        }
    }

    // Si no hay caché válida, se hace la solicitud
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();

    // Guardar en caché la respuesta con el timestamp actual
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
    return data;
}

/**
 * Función para obtener y mostrar el boss destacado.
 */
function getFandomImageUrl(name) {
    const encodedName = encodeURIComponent(name);
    // Using Special:FilePath to obtain the direct file path
    return `https://tibia.fandom.com/wiki/Special:FilePath/${encodedName}.gif`;
  }
  
  async function fetchBoostedBoss() {
    const urlBosses = "https://api.tibiadata.com/v4/boostablebosses";
    try {
      const data = await fetchDataWithCache(urlBosses, "boostedBoss"); 
      const boostedBoss = data.boostable_bosses.boosted;
      const bossImageElement = document.getElementById("bossBoosted");
      bossImageElement.src = getFandomImageUrl(boostedBoss.name);
      bossImageElement.title = `Boss boosted: ${boostedBoss.name}`;
    } catch (error) {
      console.error("Error al obtener los datos del boss:", error);
    }
  }
  
  async function fetchBoostedCreature() {
    const urlCreatures = "https://api.tibiadata.com/v4/creatures";
    try {
      const data = await fetchDataWithCache(urlCreatures, "boostedCreature");
      const boostedCreature = data.creatures.boosted;
      const creatureImageElement = document.getElementById("creatureBoosted");
      creatureImageElement.src = getFandomImageUrl(boostedCreature.name);
      creatureImageElement.title = `Creature boosted: ${boostedCreature.name}`;
    } catch (error) {
      console.error("Error al obtener los datos de la criatura:", error);
    }
  }
  