//Llamar al header

export function loadMenu() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    const menuToggle = document.getElementById("menuToggle");
    const basePath = isIndex
        ? "html/nav-menu.html" // Ruta para index.html
        : "./nav-menu.html";

    fetch(basePath)
        .then(response => response.text())
        .then(data => {
            const menuContainer = document.getElementById('menu-container');
            if (menuContainer) {
                // Insertar el contenido
                menuContainer.innerHTML = data;

                // Ajustar los href de los enlaces
                const links = menuContainer.querySelectorAll("a");
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
                // Re-seleccionar `menuToggle` después de cargar el HTML dinámicamente
                const menuToggle = document.getElementById("menuToggle");
                if (menuToggle) {
                    menuToggle.addEventListener("click", () => {
                        const menuIzq = document.querySelector("aside");
                        if (menuIzq) {
                            menuIzq.classList.toggle("show");
                        }
                    });
                }

            }
        })
        .catch(error => console.error('Error cargando el menu de nav:', error));


}
