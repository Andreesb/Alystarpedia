import { loadBackground } from './modules/body-background.js';
import { loadFooter } from './modules/footer.js';
import { loadHeader } from './modules/header.js';
import { fetchLatestNews, homeContainer, rotateAsideSections } from './modules/home-Container.js';
import { showMaintenancePage } from './modules/mantenimiento.js';
import { showMenuDerecho } from './modules/menu-derecho.js';
import { showMenuIzquierdo } from './modules/menu-izquierda.js';
import { setupHuntSessionProcessor } from './modules/party-hunt.js';

document.addEventListener("DOMContentLoaded", () => {
    
    // Función para obtener los datos del boss destacado
    const urlBosses = "https://api.tibiadata.com/v4/boostablebosses";

    async function fetchBoostedBoss() {
        try {
            // Realizamos la solicitud GET a la API
            const response = await fetch(urlBosses);

            // Validamos que la respuesta sea exitosa
            if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
            }

            // Parseamos los datos como JSON
            const data = await response.json();

            // Extraemos el boss destacado (featured: true)
            const boostedBoss = data.boostable_bosses.boosted;

            // Seleccionamos los elementos del DOM donde mostraremos la información
            const bossImageElement = document.getElementById("bossBoosted");

            // Insertamos el nombre y la imagen en los elementos
            bossImageElement.src = boostedBoss.image_url;

            bossImageElement.title =  `Boss boosted: ${boostedBoss.name}`;

        } catch (error) {
            console.error("Error al obtener los datos del boss:", error);
        }
    }

    const urlCreatures = "https://api.tibiadata.com/v4/creatures";

    // Función para obtener los datos de la criatura destacada
    async function fetchBoostedCreature() {
        try {
            // Realizamos la solicitud GET a la API
            const response = await fetch(urlCreatures);

            // Validamos que la respuesta sea exitosa
            if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
            }

            // Parseamos los datos como JSON
            const data = await response.json();

            // Extraemos la criatura destacada (featured: true)
            const boostedCreature = data.creatures.boosted;

            // Seleccionamos el elemento de la imagen
            const creatureImageElement = document.getElementById("creatureBoosted");

            // Insertamos la URL de la imagen en el atributo src
            creatureImageElement.src = boostedCreature.image_url;

            // Agregamos el nombre de la criatura como título de la imagen
            creatureImageElement.title = `Creature boosted: ${boostedCreature.name}`

        } catch (error) {
            console.error("Error al obtener los datos de la criatura:", error);
        }
    }

    // Llamamos a la función al cargar la página
    fetchBoostedCreature();

    // Llamamos a la función al cargar la página
    fetchBoostedBoss();

    
    document.addEventListener("click", (event) => {
        const target = event.target.closest("a");
        if (!target) return;
    
        const href = target.getAttribute("href");
        if (!href || href.trim() === "" || href === "#") {
            event.preventDefault();
            showMaintenancePage();
        }
    });

    setupHuntSessionProcessor("processButton", "sessionInput", "party-session");

    loadHeader();
    loadBackground();
    showMenuDerecho();
    rotateAsideSections();
    homeContainer();
    showMenuIzquierdo();
    fetchLatestNews();
    loadFooter();


});