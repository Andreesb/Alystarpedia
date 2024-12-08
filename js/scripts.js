
import { loadFooter } from './modules/footer.js';
import { loadHeader } from './modules/header.js';
import { actualizarRashid } from './modules/rashid.js';

document.addEventListener("DOMContentLoaded", () => {
    
    loadHeader();
    actualizarRashid();
    loadFooter();

    const menuToggle = document.getElementById("menuToggle");
    const aside = document.querySelector("aside");

    menuToggle.addEventListener("click", () => {
        aside.classList.toggle("show");
    });

    



    // Función para obtener los datos del boss destacado
    const urlBosses = "https://api.tibiadata.com/v4/boostablebosses";

    async function fetchBoostedBoss() {
        try {
            // Realizamos la solicitud GET a la API
            const response = await fetch(urlBosses);

            // Validamos que la respuesta sea exitosa
            if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
            }

            // Parseamos los datos como JSON
            const data = await response.json();

            // Extraemos el boss destacado (featured: true)
            const boostedBoss = data.boostable_bosses.boosted;

            // Seleccionamos los elementos del DOM donde mostraremos la información
            const bossImageElement = document.getElementById("bossBoosted");

            // Insertamos el nombre y la imagen en los elementos
            bossImageElement.src = boostedBoss.image_url;

            bossImageElement.title =  `Boss boosted: ${boostedBoss.name}`;

        } catch (error) {
            console.error("Error al obtener los datos del boss:", error);
        }
    }

    const urlCreatures = "https://api.tibiadata.com/v4/creatures";

    // Función para obtener los datos de la criatura destacada
    async function fetchBoostedCreature() {
        try {
            // Realizamos la solicitud GET a la API
            const response = await fetch(urlCreatures);

            // Validamos que la respuesta sea exitosa
            if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
            }

            // Parseamos los datos como JSON
            const data = await response.json();

            // Extraemos la criatura destacada (featured: true)
            const boostedCreature = data.creatures.boosted;

            // Seleccionamos el elemento de la imagen
            const creatureImageElement = document.getElementById("creatureBoosted");

            // Insertamos la URL de la imagen en el atributo src
            creatureImageElement.src = boostedCreature.image_url;

            // Agregamos el nombre de la criatura como título de la imagen
            creatureImageElement.title = `Creature boosted: ${boostedCreature.name}`

        } catch (error) {
            console.error("Error al obtener los datos de la criatura:", error);
        }
    }

    // Llamamos a la función al cargar la página
    fetchBoostedCreature();

    // Llamamos a la función al cargar la página
    fetchBoostedBoss();


    document.querySelector('.lupa').addEventListener('click', function () {
        const search = document.querySelector('.search');
        search.classList.toggle('active');
        const searchContainer = document.querySelector('.search-Bar');
        searchContainer.classList.toggle('active'); // Agrega o quita la clase activa
    });


    const retratoGaleria = document.getElementById('retrato-galeria');
    const galleryImages = document.querySelectorAll('.gallery img');
    const overlay = document.querySelector('#overlay');
    const overlayImage = document.querySelector('#expanded-image');
    const closeBtn = document.querySelector('#close-overlay');
    const prevBtn = document.querySelector('#prev-btn');
    const nextBtn = document.querySelector('#next-btn');

    let currentImageIndex = 0; // Índice de la imagen actual
    let autoRotate;

    // Función para mostrar la imagen activa en la galería
    function showActiveImage(index) {
        galleryImages.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });

        // Sincronizar con el overlay si está activo
        if (overlay.classList.contains('active')) {
            overlayImage.src = galleryImages[index].src;
        }
    }

    // Función para abrir el overlay
    function openOverlay(index) {
        overlay.classList.add('active');
        overlayImage.src = galleryImages[index].src;
        currentImageIndex = index;
        clearInterval(autoRotate); // Detener rotación automática al abrir el overlay
    }

    // Función para cerrar el overlay
    function closeOverlay() {
        overlay.classList.remove('active');
        startAutoRotate(); // Reanudar rotación automática al cerrar el overlay
    }

    // Función para cambiar la imagen manualmente
    function changeImage(step) {
        currentImageIndex = (currentImageIndex + step + galleryImages.length) % galleryImages.length;
        showActiveImage(currentImageIndex);
    }

    // Rotación automática
    function startAutoRotate() {
        autoRotate = setInterval(() => {
            changeImage(1); // Cambiar a la siguiente imagen cada 5 segundos
        }, 5000);
    }

    // Manejar clics en miniaturas
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openOverlay(index));
    });

    // Manejar clic en el overlay para cerrarlo
    closeBtn.addEventListener('click', closeOverlay);

    // Navegación con flechas solo si el overlay está activo
    document.addEventListener('keydown', (e) => {
        if (overlay.classList.contains('active')) {
            if (e.key === 'ArrowRight') changeImage(1);
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'Escape') closeOverlay(); // Cerrar overlay con Escape

            // Prevenir el comportamiento por defecto de las flechas
            e.preventDefault();
        }
    });

    // Evento para mostrar el overlay al hacer clic en "retrato-galeria"
    retratoGaleria.addEventListener('click', () => {
        openOverlay(currentImageIndex);
    
        const section = retratoGaleria.querySelector('.item-menu');
        if (section) {
        section.style.display = section.style.display === 'block' ? 'none' : 'block';
        }
    });

    // Cambiar imagen con los botones de navegación
    prevBtn.addEventListener('click', () => changeImage(-1));
    nextBtn.addEventListener('click', () => changeImage(1));

    // Iniciar la rotación automática
    startAutoRotate();



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

    const maintenancePage = document.getElementById("maintenancePage");
    const closeButton = document.getElementById("closeMaintenance");

    const showMaintenancePage = () => {
        maintenancePage.style.display = "flex";
    };

    // Función para cerrar la página
    const closeMaintenancePage = () => {
        maintenancePage.style.display = "none";
    };

    // Escucha los clics en todos los enlaces
    document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            // Verifica si el `href` está vacío, nulo, o apunta a "#"
            if (!href || href.trim() === "" || href === "#") {
                event.preventDefault(); // Evita la navegación predeterminada
                showMaintenancePage();
            }
        });
    });

    // Cierra la página de mantenimiento al hacer clic en el botón
    closeButton.addEventListener("click", closeMaintenancePage);



});