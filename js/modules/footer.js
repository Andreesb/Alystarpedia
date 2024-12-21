//Llamar al footer

export function loadFooter () {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    
    const basePath = isIndex
            ? "html/footer.html" // Ruta para index.html
            : "./footer.html";
    
        fetch(basePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Error cargando el footer:', error));
}