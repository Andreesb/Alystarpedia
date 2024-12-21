let galleryImages, overlay, overlayImage, closeBtn, prevBtn, nextBtn;

let currentImageIndex = 0; // Índice de la imagen actual
let autoRotate;

// Función para mostrar la imagen activa en la galería
export function showActiveImage(index) {
    galleryImages = document.querySelectorAll('.gallery img');
    overlay = document.querySelector('#overlay');
    overlayImage = document.querySelector('#expanded-image');
    galleryImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openOverlay(index));
    });


    // Sincronizar con el overlay si está activo
    if (overlay.classList.contains('active')) {
        overlayImage.src = galleryImages[index].src;
    }
}

// Función para abrir el overlay
export function openOverlay(index) {
    galleryImages = document.querySelectorAll('.gallery img');
    overlay = document.querySelector('#overlay');
    overlayImage = document.querySelector('#expanded-image');
    overlay.classList.add('active');
    overlayImage.src = galleryImages[index].src;
    currentImageIndex = index;
    clearInterval(autoRotate); // Detener rotación automática al abrir el overlay
}

// Función para cerrar el overlay
export function closeOverlay() {
    overlay = document.querySelector('#overlay');
    overlay.classList.remove('active');
    startAutoRotate(); // Reanudar rotación automática al cerrar el overlay
}

// Función para cambiar la imagen manualmente
export function changeImage(step) {
    galleryImages = document.querySelectorAll('.gallery img');
    overlay = document.querySelector('#overlay');
    overlayImage = document.querySelector('#expanded-image');
    currentImageIndex = (currentImageIndex + step + galleryImages.length) % galleryImages.length;
    showActiveImage(currentImageIndex);
}

// Rotación automática
export function startAutoRotate() {
    autoRotate = setInterval(() => {
        changeImage(1); // Cambiar a la siguiente imagen cada 5 segundos
    }, 5000);
}

