//Llamar al fondo

export function loadBackground() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    const basePath = isIndex
        ? "/html/background-image.html" // Ruta para index.html
        : "./background-image.html";

    fetch(basePath)
        .then(response => response.text())
        .then(data => {
            const backgroundContainer = document.getElementById('background-image');
            if (backgroundContainer) {
                // Insertar el contenido del header
                backgroundContainer.innerHTML = data;

                // Ajustar los href de los enlaces
                const links = backgroundContainer.querySelectorAll("a");
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
        .catch(error => console.error('Error cargando el fondo:', error));
}