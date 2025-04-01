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

    // Array con los títulos (nombres de las ciudades) en el mismo orden
    const titulosCiudades = [
        "Carlin",       // Domingo
        "Svargrond",    // Lunes
        "Liberty Bay",  // Martes
        "Port Hope",    // Miércoles
        "Ankrahmun",    // Jueves
        "Darashia",     // Viernes
        "Edron"         // Sábado
    ];

    const mapasRashid = {
        0: "/html/mapper.html?x=1748&y=2421&floor=1&zoom=1.5",   // Carlin (Domingo)
        1: "/html/mapper.html?x=1383&y=540&floor=0&zoom=1.5",    // Svargrond (Lunes)
        2: "/html/mapper.html?x=1675&y=5570&floor=0&zoom=1.5",   // Liberty Bay (Martes)
        3: "/html/mapper.html?x=2500&y=5331&floor=0&zoom=1.5",   // Port Hope (Miércoles)
        4: "/html/mapper.html?x=3967&y=5725&floor=1&zoom=1.5",  // Ankrahmun (Jueves)
        5: "/html/mapper.html?x=4469&y=4520&floor=0&zoom=1.5",  // Darashia (Viernes)
        6: "/html/mapper.html?x=4277&y=2501&floor=1&zoom=1.5"     // Edron (Sábado)
    };

    // Obtener la fecha actual en CET (usando la zona horaria de Europa/Berlín)
    const now = new Date();
    const cetNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
    
    // Si la hora CET es menor a 10, se considera que aún no se produjo el server save
    if (cetNow.getHours() < 10) {
        cetNow.setDate(cetNow.getDate() - 1);
    }
    
    // Obtener el día de la semana según la fecha ajustada
    const diaActual = cetNow.getDay();
    
    // Determinar la ruta base para las imágenes según la ubicación actual (index o no)
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    const basePath = isIndex ? "assets/media/Rashid/" : "../assets/media/Rashid/";
    
    // Seleccionar elementos del DOM
    const imgElemento = document.getElementById("rashid-City");
    const rashidNPC = document.querySelector(".rashid-NPC");
    const rashidPedestal = document.querySelector(".rashid-pedestal");
    const rashidMap = document.getElementById("rashid-map");
    
    // Actualizar imagen, mapa y title usando el día ajustado
    imgElemento.src = `${basePath}${diasSemana[diaActual]}`;
    imgElemento.alt = `Rashid Location`;
    imgElemento.title = titulosCiudades[diaActual]; // Agrega el title según la ciudad
    
    rashidMap.src = mapasRashid[diaActual];
    
    // Ajuste de posición según el día (por ejemplo, para el domingo se coloca distinto)
    if (diaActual === 0) { // Domingo
        rashidNPC.style.left = "65%";
        rashidPedestal.style.left = "60%";
    } else {
        rashidNPC.style.left = "5%";
        rashidPedestal.style.left = "0";
    }
}
