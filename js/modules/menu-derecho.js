import { showActiveImage, startAutoRotate } from "./galeria.js";
import { showMaintenancePage } from "./mantenimiento.js";

export function showMenuDerecho() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    const menuContenedor = document.querySelector('.contenedor-derecho');
    const basePath = isIndex
        ? "html/menu-derecho.html"
        : "./menu-derecho.html";

    fetch(basePath)
        .then(response => response.text())
        .then(data => {
            menuContenedor.innerHTML = data;
            showExp();
            startAutoRotate();
            menuExpand();
            showActiveImage();

            // Configurar eventos en enlaces
            const links = menuContenedor.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href');

                if (!href || href.trim() === "" || href === "#") {
                    link.addEventListener("click", (event) => {
                        event.preventDefault();
                        showMaintenancePage();
                    });
                } else if (isIndex && href.startsWith("./")) {
                    link.setAttribute('href', href.replace("./", "html/"));
                } else if (!isIndex && href.startsWith("html/")) {
                    link.setAttribute('href', href.replace("html/", "./"));
                }
            });
        })
        .catch(error => console.error('Error cargando el menú derecho:', error));
}

export function menuExpand(){
    document.querySelector('.lupa').addEventListener('click', function () {
        const search = document.querySelector('.search');
        search.classList.toggle('active');
        const searchContainer = document.querySelector('.search-Bar');
        searchContainer.classList.toggle('active');
    });

    const menuDinamicoItems = document.querySelectorAll('.menu-dinamico ul');

    menuDinamicoItems.forEach((item, index) => {
      // Evento 'click' en cada <ul>
        item.addEventListener('click', () => {
            console.log(`Se hizo clic en el elemento ${index + 1}`);
        
            // Buscar la sección hija
            const section = item.querySelector('section');
            if (section) {
            console.log('Se encontró una sección:', section);
        
            // Alternar la clase 'expandido'
            section.classList.toggle('expandido');
            console.log('Clase aplicada:', section.classList);
        
            // Cerrar otras secciones
            menuDinamicoItems.forEach((otherItem, otherIndex) => {
                if (otherItem !== item) {
                const otherSection = otherItem.querySelector('section');
                if (otherSection) {
                    otherSection.classList.remove('expandido');
                    console.log(`Se cerró la sección del elemento ${otherIndex + 1}`);
                }
                }
            });
            } else {
            console.log('No se encontró ninguna sección en este <ul>.');
            }
        });
    });

    // Evitar que se cierre la sección al hacer clic dentro de ella
    document.querySelectorAll(".menu-dinamico section").forEach(section => {
        section.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    });

}
export function calculateExp(level) {
    const shareExpMin = Math.floor((level * 2) / 3);
    const shareExpMax = Math.floor((level * 3) / 2);

    return { min: shareExpMin, max: shareExpMax };
}

export function showExp() {
    document.querySelectorAll(".party-share").forEach(input => {
        input.addEventListener("input", function () {
            const level = parseInt(this.value, 10);
            const tooltip = document.getElementById("tooltip");
            const miniTooltip = document.getElementById("mini-tooltip");
            let maxLevel = 3001;

            if (!isNaN(level) && level > 0) {
                const { min, max } = calculateExp(level);
                tooltip.textContent = ` You can share exp between \n level's ${min} and ${max}.`;
                tooltip.style.visibility = "visible";
                tooltip.style.opacity = "1";
                //Minitooltip
                miniTooltip.textContent = ` You can share exp \n between \n level's ${min} and ${max}.`;
                miniTooltip.style.opacity = "1";
                miniTooltip.style.visibility = "visible";
                
            } else if (!isNaN(level) && (level >= maxLevel || level <= 0)) {
                tooltip.textContent = ` Please enter a valid level`;
                tooltip.style.visibility = "visible";
                tooltip.style.opacity = "1";
                //Minitooltip
                miniTooltip.textContent = ` Please enter a valid level`;
                miniTooltip.style.visibility = "visible";
                miniTooltip.style.opacity = "1";
            }  else {
                tooltip.style.opacity = "0";
                tooltip.style.visibility = "hidden";
            }
        });
    });
    
    
}


