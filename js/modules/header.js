//Llamar al header

export function loadHeader() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    const basePath = isIndex
        ? "/html/header.html" // Ruta para index.html
        : "./header.html";

    fetch(basePath)
        .then(response => response.text())
        .then(data => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                // Insertar el contenido del header
                headerContainer.innerHTML = data;

                // Ajustar el background-image del header según la página
                if (headerContainer) {
                    // Aquí cambiamos el path del background-image
                    if (isIndex) {
                        headerContainer.style.backgroundImage = "url()";
                    } else {
                        // Para otras páginas, ajusta el path del background
                        headerContainer.style.backgroundImage = "url()";
                    }
                }

                // Ajustar los href de los enlaces
                const links = headerContainer.querySelectorAll("a");
                links.forEach(link => {
                    const href = link.getAttribute("href");

                    // Si estás en el index, asegúrate de que los enlaces sean relativos a la raíz
                    if (isIndex) {
                        link.setAttribute("href", `${href}`);
                        
                    } else {
                        // Si no estás en el index, ajusta los enlaces para ser relativos al directorio actual
                        link.setAttribute("href", `../${href}`);
                        
                    }
                });
            }
        })
        .catch(error => console.error('Error cargando el header:', error));
}
