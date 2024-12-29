import { hideLoader, showLoader } from "./loader.js";

export function homeContainer() {
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    const basePath = isIndex
        ? "html/home-container.html" // Ruta para index.html
        : "./home-container.html";

    fetch(basePath)
        .then(response => response.text())
        .then(data => {
            const dataContainer = document.getElementById('data-container');
            if (dataContainer) {
                // Insertar el contenido del header
                dataContainer.innerHTML = data;
                showLoader();
                initShortcutsCarousel();


                // Ajustar los href de los enlaces
                const links = dataContainer.querySelectorAll("a");
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
            }
        })
        .catch(error => console.error('Error cargando el contenedor de la data:', error));
}


export function initShortcutsCarousel() {
    const shortcutsSection = document.getElementById('shortcuts-tools');
    let shortcutItems = Array.from(shortcutsSection.children); // Obtener los elementos <a>
    let visibleItems = shortcutItems.length;

    // Variables de control
    let carouselInterval;
    let carouselActive = false;

    function updateCarousel() {
        const screenWidth = window.innerWidth;

        if (screenWidth <= 1615) {
            visibleItems = shortcutItems.length - 1; // Oculta el último elemento
            shortcutsSection.classList.add('carousel-active'); // Activa el estilo de carrusel
            startCarousel();
        } else if (screenWidth <= 1400) {
            visibleItems = shortcutItems.length - 2; // Oculta dos elementos (por ejemplo)
            startCarousel();
        } else {
            resetCarousel(); // Resetear si la pantalla es mayor a 1615px
        }
    }

    function startCarousel() {
        if (carouselActive) return; // Evitar que el intervalo se inicie más de una vez
        carouselActive = true;

        carouselInterval = setInterval(() => {
            const firstItem = shortcutsSection.firstElementChild;
            shortcutsSection.removeChild(firstItem); // Elimina el primer elemento
            shortcutsSection.appendChild(firstItem); // Lo añade al final (efecto rotativo)
        }, 3000); // Intervalo de 3 segundos
    }

    function resetCarousel() {
        if (!carouselActive) return;
        clearInterval(carouselInterval);
        carouselActive = false;
        shortcutsSection.classList.remove('carousel-active');
        shortcutsSection.innerHTML = ''; // Limpia y vuelve a insertar los elementos
        shortcutItems.forEach((item) => shortcutsSection.appendChild(item));
    }

    // Eventos para controlar el tamaño de la ventana
    window.addEventListener('resize', updateCarousel);
    updateCarousel(); // Ejecutar al iniciar
}

export function rotateAsideSections() {
    const waitForAside = setInterval(() => {
        const aside = document.querySelector('#shortcuts-section');
        if (aside) {
            clearInterval(waitForAside);

            const sections = aside.querySelectorAll('section');
            let visibleIndex = 0;

            function updateVisibleSections() {
                // Limpiar las clases de visibilidad
                sections.forEach((section) => {
                    section.classList.remove('visible');
                });

                // Mostrar las dos secciones siguientes
                sections.forEach((section, index) => {
                    if (index === visibleIndex || index === (visibleIndex + 1) % sections.length) {
                        section.classList.add('visible');
                    }
                });

                // Actualizar el índice visible
                visibleIndex = (visibleIndex + 2) % sections.length;
            }

            updateVisibleSections();
            setInterval(updateVisibleSections, 7000); // Cambiar cada 3 segundos
        }
    }, 100); // Revisa cada 100 ms si el aside ya está disponible
}



// Función para obtener el ID de la última noticia
export async function fetchLatestNews() {
    try {
        // Solicitar la última noticia
        const response = await fetch('https://api.tibiadata.com/v4/news/latest');
        const data = await response.json();
        
        
        // Verificar si hay noticias
        if (data && data.news && data.news.length > 0) {
            const latestNewsId = data.news[0].id;  // Obtener el ID de la última noticia
            fetchNewsDetails(latestNewsId);  // Llamar a la función para obtener detalles de la noticia
        } else {
            console.error('No se encontraron noticias.');
        }
    } catch (error) {
        console.error('Error fetching latest news:', error);
    }
}

// Función para obtener detalles de una noticia por su ID
async function fetchNewsDetails(newsId) {
    try {
        // Hacer la solicitud para obtener los detalles de la noticia
        const response = await fetch(`https://api.tibiadata.com/v4/news/id/${newsId}`);
        const data = await response.json();

        // Verificar si los detalles de la noticia están disponibles
        if (data && data.news) {
            displayNews(data.news);  // Mostrar los detalles de la noticia
        } else {
            console.error('No se encontraron detalles de la noticia.');
        }
    } catch (error) {
        console.error('Error fetching news details:', error);
    }
}

// Función para mostrar los detalles de la noticia en el contenedor
export function displayNews(newsData) {
    const newsContainer = document.getElementById('news-container');
    const htmlContent = `
    <h2>Tibia News</h2>
    <div id="loader"></div>
        <div class="news-text">
        <a href="${newsData.url}" target="_blank">
            <h5>${newsData.date}</h5>
            <h2>${newsData.title}</h2>
            <p>${newsData.content_html}</p>
        </a></p>
    </div>

    `;
    
    newsContainer.innerHTML = htmlContent;  // Insertar el contenido en el contenedor
    hideLoader();
}


