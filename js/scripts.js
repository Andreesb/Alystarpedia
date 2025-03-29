import { loadBackground } from './modules/body-background.js';
import { loadFooter } from './modules/footer.js';
import { loadHeader } from './modules/header.js';
import { fetchLatestNews, homeContainer, rotateAsideSections } from './modules/home-Container.js';
import { showMaintenancePage } from './modules/mantenimiento.js';
import { showMenuDerecho } from './modules/menu-derecho.js';
import { showMenuIzquierdo } from './modules/menu-izquierda.js';
import { loadMenu } from './modules/nav-menu.js';
import { setupHuntSessionProcessor } from './modules/party-hunt.js';

document.addEventListener("DOMContentLoaded", () => {
    

    
    document.addEventListener("click", (event) => {
        const target = event.target.closest("a");
        if (!target) return;
    
        const href = target.getAttribute("href");
        if (!href || href.trim() === "" || href === "#") {
            event.preventDefault();
            showMaintenancePage();
        }
    });

    // Función global que actualiza la posición de los menus y el header
    function handleScroll() {
        const scrollY = window.scrollY;
        const footer = document.querySelector("footer");

        // Actualizar .contenedor-izquierdo
        const contIzq = document.querySelector(".contenedor-izquierdo");
        if (contIzq) {
            let newTop = Math.max(150, 250 - scrollY);
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const contenedorHeight = contIzq.offsetHeight;
                const margin = 50;
                // Si el footer está cerca, ajustar newTop para evitar el solapamiento
                if (footerRect.top < window.innerHeight && footerRect.top < contenedorHeight + margin) {
                    newTop = Math.min(newTop, footerRect.top - contenedorHeight - margin);
                }
            }
            contIzq.style.top = `${newTop}px`;
        }

        // Actualizar .contenedor-derecho
        const contDer = document.querySelector(".contenedor-derecho");
        if (contDer) {
            let newTop = Math.max(150, 250 - scrollY);
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const contenedorHeight = contDer.offsetHeight;
                const margin = 50;
                if (footerRect.top < window.innerHeight && footerRect.top < contenedorHeight + margin) {
                    newTop = Math.min(newTop, footerRect.top - contenedorHeight - margin);
                }
            }
            contDer.style.top = `${newTop}px`;
        }

        // Actualizar #menu-container
        const menuContainer = document.querySelector("#menu-container");
        if (menuContainer) {
            let newTop = Math.max(80, 150 - scrollY);
            menuContainer.style.top = `${newTop}px`;
        }

        // Actualizar header (logoText)
        const header = document.querySelector("header");
        if (header) {
            let newTop = Math.max(-90, 0 - scrollY);
            header.style.top = `${newTop}px`;
        }
    }

    // Forzar que la página se cargue siempre desde arriba
    window.onbeforeunload = () => window.scrollTo(0, 0);

    // Ejecutar la función en cada scroll y al cargar la página
    document.addEventListener("scroll", handleScroll);
    window.addEventListener("load", handleScroll);


    

    setupHuntSessionProcessor("processButton", "sessionInput", "party-session");

    
    loadHeader();
    loadBackground();
    showMenuDerecho();
    rotateAsideSections();
    homeContainer();
    showMenuIzquierdo();
    loadMenu();
    fetchLatestNews();
    loadFooter();


});