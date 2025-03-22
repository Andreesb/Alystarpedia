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
    new ShortcutsCarousel('shortcuts-tools', {
        autoScrollDelay: 3000,
        pauseOnHover: true,
        enableKeyboard: true,
        restartDelay: 5000 // Reinicia la rotación tras 5s de inactividad
    });
}


export function rotateAsideSections() {
    const waitForAside = setInterval(() => {
        const aside = document.querySelector('#shortcuts-section');
        if (aside) {
            clearInterval(waitForAside);

            const sections = aside.querySelectorAll('section');
            if (sections.length < 2) return; // Asegurar que haya al menos 2 secciones

            let visibleIndex = 0;

            function updateVisibleSections() {
                // Ocultar todas las secciones
                sections.forEach(section => section.classList.remove('visible'));

                // Mostrar solo la sección actual
                sections[visibleIndex].classList.add('visible');

                // Alternar entre las dos secciones (0 y 1)
                visibleIndex = visibleIndex === 0 ? 1 : 0;
            }

            updateVisibleSections();
            setInterval(updateVisibleSections, 7000); // Cambiar cada 7 segundos
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


class ShortcutsCarousel {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');

        // Configuración por defecto
        this.config = {
        autoScrollDelay: 3000,
        pauseOnHover: true,
        enableKeyboard: false,
        restartDelay: 5000, // Tiempo tras el cual se reinicia la rotación automática
        ...options
        };

        this.autoScroll = null;
        this.restartTimeout = null; // Para manejar el reinicio automático

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoScroll();
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => {
        this.movePrev();
        this.resetAutoScroll();
        });

        this.nextBtn?.addEventListener('click', () => {
        this.moveNext();
        this.resetAutoScroll();
        });

        if (this.config.pauseOnHover) {
        this.container.addEventListener('mouseenter', () => this.stopAutoScroll());
        this.container.addEventListener('mouseleave', () => this.resetAutoScroll());
        }

        if (this.config.enableKeyboard) {
        document.addEventListener('keydown', (event) => this.handleKeyNavigation(event));
        }
    }

    moveNext() {
        const firstItem = this.container.firstElementChild;
        if (firstItem) {
        this.container.appendChild(firstItem);
        }
    }

    movePrev() {
        const lastItem = this.container.lastElementChild;
        if (lastItem) {
        this.container.insertBefore(lastItem, this.container.firstElementChild);
        }
    }

    startAutoScroll() {
        if (!this.autoScroll) {
        this.autoScroll = setInterval(() => this.moveNext(), this.config.autoScrollDelay);
        }
    }

    stopAutoScroll() {
        if (this.autoScroll) {
        clearInterval(this.autoScroll);
        this.autoScroll = null;
        }
    }

    resetAutoScroll() {
        this.stopAutoScroll();

        // Si ya hay un temporizador de reinicio activo, lo reseteamos
        if (this.restartTimeout) {
        clearTimeout(this.restartTimeout);
        }

        // Programamos el reinicio después de `restartDelay`
        this.restartTimeout = setTimeout(() => this.startAutoScroll(), this.config.restartDelay);
    }

    handleKeyNavigation(event) {
        if (event.key === "ArrowLeft") {
        this.movePrev();
        this.resetAutoScroll();
        } else if (event.key === "ArrowRight") {
        this.moveNext();
        this.resetAutoScroll();
        }
    }

    destroy() {
        this.stopAutoScroll();
        clearTimeout(this.restartTimeout);

        this.prevBtn?.removeEventListener('click', this.boundMovePrev);
        this.nextBtn?.removeEventListener('click', this.boundMoveNext);
        this.container.removeEventListener('mouseenter', this.boundStopAutoScroll);
        this.container.removeEventListener('mouseleave', this.boundStartAutoScroll);

        if (this.config.enableKeyboard) {
        document.removeEventListener('keydown', this.boundKeyNavigation);
        }
    }
}
