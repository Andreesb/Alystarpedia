//Llamar al header

export function loadHeader() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    const basePath = isIndex
        ? "html/header.html" // Ruta para index.html
        : "./header.html";

    fetch(basePath)
        .then(response => response.text())
        .then(data => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                // Insertar el contenido del header
                headerContainer.innerHTML = data;

                // Ajustar los href de los enlaces
                const links = headerContainer.querySelectorAll("a");
                links.forEach(link => {
                    const href = link.getAttribute("href");
                    if (href && !href.startsWith("/")) {
                        link.setAttribute("href", `../${href}`);
                    }
                });
            }
        })
        .catch(error => console.error('Error cargando el header:', error));
}
