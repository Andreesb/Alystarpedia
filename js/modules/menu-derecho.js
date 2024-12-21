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
            showActiveImage();

            startAutoRotate();

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
