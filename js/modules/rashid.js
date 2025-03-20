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

    const mapasRashid = {
        0: "/html/mapper.html?x=582&y=807&floor=9", // Carlin (Domingo)
        1: "/html/mapper.html?x=464&y=179&floor=8", // Svargrond (Lunes)
        2: "/html/mapper.html?x=558&y=1857&floor=8", // Liberty Bay (Martes)
        3: "/html/mapper.html?x=833&y=1778&floor=8", // Port Hope (Miércoles)
        4: "/html/mapper.html?x=1324&y=1904&floor=9", // Ankrahmun (Jueves)
        5: "/html/mapper.html?x=1490&y=1506&floor=8", // Darashia (Viernes)
        6: "/html/mapper.html?x=1425&y=834&floor=9"  // Edron (Sábado)
    };

    const fechaActual = new Date();
    const diaActual = fechaActual.getDay();

    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    const basePath = isIndex ? "assets/media/Rashid/" : "../assets/media/Rashid/";

    const imgElemento = document.getElementById("rashid-City");
    const rashidNPC = document.querySelector(".rashid-NPC");
    const rashidPedestal = document.querySelector(".rashid-pedestal");
    const rashidMap = document.getElementById("rashid-map");

    imgElemento.src = `${basePath}${diasSemana[diaActual]}`;
    imgElemento.alt = `Imagen de la ciudad del día`;

    rashidMap.src = mapasRashid[diaActual]; // Cambia el mapa según el día

    if (diaActual === 0) { // Domingo
        rashidNPC.style.left = "65%";
        rashidPedestal.style.left = "60%";
    } else {
        rashidNPC.style.left = "5%";
        rashidPedestal.style.left = "0";
    }
}
