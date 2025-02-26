export function showLoader() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    
    const basePath = isIndex
            ? "html/loader.html" // Ruta para index.html
            : "./loader.html";
    
        fetch(basePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('loader').innerHTML = data;
        })
        .catch(error => console.error('Error cargando el header:', error));
    
    const loader = document.getElementById("loader");
    loader.style.display = "flex"; // Muestra el loader

    setTimeout(() => {
        loader.style.display = "none"; // Oculta el loader
    }, 1000);
}


export function hideLoader() {
    const loader = document.getElementById("loader");
    loader.style.display = "none";
}