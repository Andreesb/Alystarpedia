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
            let newSize = Math.max(1.8, 2 - scrollY);
            header.style.top = `${newTop}px`;
            header.style.fontSize = `${newSize}rem`;
        }
    }

    // Forzar que la página se cargue siempre desde arriba
    window.onbeforeunload = () => window.scrollTo(0, 0);

    // Ejecutar la función en cada scroll y al cargar la página
    document.addEventListener("scroll", handleScroll);
    window.addEventListener("load", handleScroll);

    // Funciones del tooltip (definidas previamente)
    async function showTooltip(e) {
        const target = e.currentTarget;
        const tipText = target.getAttribute("data-tooltip");
        if (!tipText) return;
        tooltip.textContent = tipText;
        tooltip.style.left = e.pageX + 10 + "px";
        tooltip.style.top = e.pageY + 10 + "px";
        tooltip.style.opacity = "1";
    }
    
    function moveTooltip(e) {
        tooltip.style.left = e.pageX + 10 + "px";
        tooltip.style.top = e.pageY + 10 + "px";
    }
    
    function hideTooltip() {
        tooltip.style.opacity = "0";
    }
    
    // Crear el tooltip reutilizable
    const tooltip = document.createElement("div");
    tooltip.className = "custom-tooltip";
    document.body.appendChild(tooltip);
    
    // Función para inicializar tooltips en elementos con "title"
    async function initTooltips() {
        const elements = document.querySelectorAll("*[title]");
        console.log("Elementos con title encontrados:", elements.length);
        elements.forEach((el) => {
        // Si ya se le asignó data-tooltip, no volver a hacerlo
        if (!el.hasAttribute("data-tooltip")) {
            const tip = el.getAttribute("title");
            el.setAttribute("data-tooltip", tip);
            el.removeAttribute("title");
    
            el.addEventListener("mouseenter", showTooltip);
            el.addEventListener("mousemove", moveTooltip);
            el.addEventListener("mouseleave", hideTooltip);
        }
        });
    }
    

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

    // Ejecutar al cargar el DOM
    document.addEventListener("DOMContentLoaded", () => {
        initTooltips();
    });
    
    // Usar MutationObserver para detectar nuevos elementos con title
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
            // Si el nodo en sí tiene el atributo title
            if (node.hasAttribute && node.hasAttribute("title")) {
                initTooltips();
            }
            // O si contiene elementos con title
            const childs = node.querySelectorAll ? node.querySelectorAll("*[title]") : [];
            if (childs.length > 0) {
                initTooltips();
            }
            }
        });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });


});