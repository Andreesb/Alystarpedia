//Llamar al header

export function loadHeader() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    
    const basePath = isIndex
            ? "html/header.html" // Ruta para index.html
            : "./header.html";
    
        fetch(basePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Error cargando el header:', error));
}