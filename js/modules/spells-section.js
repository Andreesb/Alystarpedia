document.addEventListener("DOMContentLoaded", () => {
    const spellInfoSections = document.querySelectorAll(".spell-info");
    const categorySections = document.querySelectorAll(".spell-category");
    const levelSections = document.querySelectorAll(".level-info");

    function showVocation(vocationId) {
        spellInfoSections.forEach(section => {
            section.style.display = (section.id === vocationId) ? "block" : "none";
        });
    }

    function showCategory(categoryId) {
        categorySections.forEach(section => {
            section.style.display = (section.id === categoryId) ? "block" : "none";
        });
    }

    function showLevel(levelId) {
        levelSections.forEach(section => {
            section.style.display = (section.id === levelId) ? "block" : "none";
        });
    }

    // Detectar si hay un hash en la URL al cargar la página
    function checkHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showVocation(hash);
        }
    }

    checkHash(); // Ejecutar en la carga inicial

    // Evento para cambiar la vocación si el hash cambia
    window.addEventListener("hashchange", checkHash);

    document.querySelectorAll(".vocation").forEach(vocation => {
        vocation.addEventListener("click", () => {
            showVocation(vocation.getAttribute("data-vocation"));
        });
    });

    document.querySelectorAll(".category-btn").forEach(button => {
        button.addEventListener("click", () => {
            showCategory(button.getAttribute("data-category"));
        });
    });

    document.querySelectorAll(".level-btn").forEach(button => {
        button.addEventListener("click", () => {
            showLevel(button.getAttribute("data-level"));
        });
    });
});
