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

