export function actualizarRashid() {
    const diasSemana = [
        "carlin.webp",       // Domingo
        "svargrond.webp",    // Lunes
        "liberty-bay.webp",  // Martes
        "port-hope.webp",    // Miércoles
        "ankrahmun.webp",    // Jueves
        "darashia.webp",     // Viernes
        "edron.webp"         // Sábado
    ];

    const fechaActual = new Date();
    const diaActual = fechaActual.getDay();

    // Determinar si estamos en el index.html u otra página
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    // Definir la ruta base según la página
    const basePath = isIndex
        ? "assets/media/Rashid/" // Ruta para index.html
        : "../assets/media/Rashid/"; // Ruta para otras páginas

    // Obtener el contenedor y la imagen
    const imgElemento = document.getElementById("rashid-City");
    const rashidNPC = document.querySelector(".rashid-NPC");
    const rashidPedestal = document.querySelector(".rashid-pedestal");

    // Actualizar la imagen según el día
    imgElemento.src = `${basePath}${diasSemana[diaActual]}`;
    imgElemento.alt = `Imagen de la ciudad del día`;

    // Cambiar la posición según el día
    if (diaActual === 0) { // Domingo
        rashidNPC.style.left = "65%";
        rashidPedestal.style.left = "60%";
    } else {
        rashidNPC.style.left = "5%";
        rashidPedestal.style.left = "0"; // Posición normal para otros días
    }
}