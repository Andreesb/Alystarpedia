const maintenancePage = document.getElementById("maintenancePage");

function mostrar () {
    maintenancePage.style.display = "flex";

}

export function showMaintenancePage() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    const basePath = isIndex
        ? "html/mantenimiento.html" // Ruta para index.html
        : "./mantenimiento.html";

    fetch(basePath)
        .then(response => response.text())
        .then(data => {
            if (maintenancePage) {
                // Insertar el contenido dinámico
                maintenancePage.innerHTML = data;

                // Asignar evento al botón de cerrar después de cargar el contenido
                const closeButton = document.getElementById("closeMaintenance");
                if (closeButton) {
                    closeButton.addEventListener("click", closeMaintenancePage);
                } else {
                    console.error("El botón 'closeMaintenance' no se encontró en el contenido cargado.");
                }
            }
        })
        .catch(error => console.error('Error cargando la página de mantenimiento:', error));
        mostrar();
}

// Función para cerrar la página
export const closeMaintenancePage = () => {
    if (maintenancePage) {
        maintenancePage.style.display = "none";
    } else {
        console.error("El contenedor 'maintenancePage' no existe en el DOM.");
    }
};
