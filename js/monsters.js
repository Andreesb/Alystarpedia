document.addEventListener("DOMContentLoaded", () => {

    function showLoader() {
        const loader = document.getElementById("loader");
        loader.style.display = "flex"; // Muestra el loader
    
        setTimeout(() => {
            loader.style.display = "none"; // Oculta el loader
        }, 2000); // 1000 ms = 1 segundo
    }


    function hideLoader() {
        const loader = document.getElementById("loader");
        loader.style.display = "none";
    }


    // URL del API para obtener todas las criaturas
    const urlCreatures = "https://api.tibiadata.com/v4/creatures";
    // Función para ordenar alfabéticamente

    let creatures = []


    // Función para obtener y mostrar todas las criaturas
    async function fetchAndDisplayCreatures() {
        showLoader();
        try {
            const response = await fetch(urlCreatures);
            if (!response.ok) throw new Error(`Error al obtener los datos: ${response.status}`);
            const data = await response.json();
    
            // Ordenar criaturas alfabéticamente por nombre (puedes usar otras funciones para otros tipos de orden)
            creatures = data.creatures.creature_list.sort((a, b) => a.name.localeCompare(b.name)); 
    
            const container = document.getElementById("creaturesContainer");
            container.innerHTML = "";
    
            creatures.forEach(creature => {
                const creatureCard = document.createElement("div");
                creatureCard.className = "creature-card";
                creatureCard.innerHTML = `
                    <img src="${creature.image_url}" alt="${creature.name}" title="${creature.name}" class="creature-image" data-race="${creature.name}" />
                    <p class="creature-name">${creature.name}</p>
                `;
                container.appendChild(creatureCard);
            });
        } catch (error) {
            console.error("Error al obtener las criaturas:", error);
        } finally {
            hideLoader();
        }
    }
        
    // Llamar a la función al cargar la página
    fetchAndDisplayCreatures();

    function displayCreatures(sortedCreatures) {
        const container = document.getElementById('creaturesContainer');
        container.innerHTML = ''; // Limpiar contenedor
    
        sortedCreatures.forEach(creature => {
            const creatureCard = document.createElement("div");
            creatureCard.className = "creature-card";
            creatureCard.innerHTML = `
                <img src="${creature.image_url}" alt="${creature.name}" title="${creature.name}" class="creature-image" data-race="${creature.name}" />
                <p class="creature-name">${creature.name}</p>
            `;
            container.appendChild(creatureCard);
        });
    }


    async function fetchCreatureData(race) {
        showLoader();
        const apiUrl = `https://api.tibiadata.com/v4/creature/${race}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al obtener los datos: ${response.status}`);
            const data = await response.json();
            displayCreatureData(data.creature);
        } catch (error) {
            console.error('Error al obtener los datos de la criatura:', error);
        } finally {
            hideLoader();
        }

        
    }

    function displayCreatureData(creature) {
        const creatureNameElement = document.getElementById("creatureName");
        creatureNameElement.textContent = creature.name;
    
        // Agregar imagen de la criatura
        const creatureImageElement = document.getElementById("creatureImage");
        if (creature.image_url) {
            creatureImageElement.src = creature.image_url;
            creatureImageElement.alt = creature.name;
            creatureImageElement.style.display = "block"; // Asegúrate de que se muestre
        } else {
            creatureImageElement.style.display = "none"; // Oculta si no hay imagen disponible
        }
    
        // Limpiar las tablas
        const mainTable = document.getElementById("mainTable");
        const secondaryTable = document.getElementById("secondaryTable");
        mainTable.innerHTML = "";
        secondaryTable.innerHTML = "";
    
        // Mapeo de valores a imágenes o GIFs
        const valueToImageMap = {
            "energy": "../assets/media/data-icons/EnergyShock_3x.webp",
            "earth": "../assets/media/data-icons/GreenCloud_3x.webp",
            "curse": "../assets/media/data-icons/Curse_3x.webp",
            "death": "../assets/media/data-icons/DeathSplash_3x.webp",
            "fire": "../assets/media/data-icons/Burning_3x.webp",
            "holy": "../assets/media/data-icons/HolyStrike_3x.webp",
            "ice": "../assets/media/data-icons/LargeIceCrystal_3x.webp",
            "physical": "../assets/media/data-icons/HitExplosion_3x.webp",
            "N/A": "../assets/media/data-icons/no.webp",
            "No": "../assets/media/data-icons/no.webp",
            "None": "../assets/media/data-icons/no.webp",
            "Yes": "../assets/media/data-icons/check.png",
            // Agrega más valores según sea necesario
        };
    
        // Función para obtener la representación de un valor (texto o imagen)
        const getValueRepresentation = (value) => {
            if (Array.isArray(value)) {
                return value.map((item) => getValueRepresentation(item)).join(" ");
            }
    
            if (typeof value === "string" && value.includes(',')) {
                const values = value.split(',').map(item => item.trim());
                return values.map(item => getValueRepresentation(item)).join(" ");
            }
    
            if (valueToImageMap[value]) {
                return `<img src="${valueToImageMap[value]}" alt="${value}" class="value-icon" />`;
            }
    
            return value;
        };
    
        // Datos para la tabla principal
        const mainTableData = [
            ['Hitpoints', creature.hitpoints],
            ['Experience Points', creature.experience_points],
            ['Loot List', Array.isArray(creature.loot_list) ? creature.loot_list.join(', ') : 'None'],
            ['Behaviour', creature.behaviour || 'Unknown'],
        ];
    
        // Datos para la tabla secundaria
        const secondaryTableData = [
            ['Weakness', Array.isArray(creature.weakness) ? creature.weakness.join(', ') : 'None'],
            ['Strong', Array.isArray(creature.strong) ? creature.strong.join(', ') : 'None'],
            ['See Invisible', creature.see_invisible ? 'Yes' : 'No'],
            ['Be Paralysed', creature.be_paralysed ? 'Yes' : 'No'],
            ['Be Summoned', creature.be_summoned ? 'Yes' : 'No'],
            ['Be Convinced', creature.be_convinced ? 'Yes' : 'No'],
            ['Convinced Mana', creature.convinced_mana || 'N/A'],
            ['Summoned Mana', creature.summoned_mana || 'N/A'],
            ['Immune', Array.isArray(creature.immune) ? creature.immune.join(', ') : 'None'],
            ['Healed', Array.isArray(creature.healed) ? creature.healed.join(', ') : 'None'],
            ['Is Lootable', creature.is_lootable ? 'Yes' : 'No'],
        ];
    
        // Función para generar el contenido de una tabla
        const generateTableContent = (data) =>
            `<table>${data.map(([label, value]) => `<tr><td>${label}</td><td>${getValueRepresentation(value)}</td></tr>`).join('')}</table>`;
    
        // Renderizar contenido en las tablas
        mainTable.innerHTML = generateTableContent(mainTableData);
        secondaryTable.innerHTML = generateTableContent(secondaryTableData);
    
        // Mostrar la sección de datos de la criatura
        document.querySelector(".creature-data").style.display = "inline-flex";
    }

    document.getElementById("creaturesContainer").addEventListener("click", (event) => {
        const card = event.target.closest(".creature-card");
        if (card) {
            const race = card.getElementById("creatureImage").getAttribute("data-race");
            fetchCreatureData(race);
        }
    });

    document.getElementById("filter-creature").addEventListener("change", (event) => {
        const option = event.target.value;
        let sortedCreatures;
    
        switch (option) {
            case 'alphabeticalAtoZ':
                sortedCreatures = creatures.sort((a, b) => a.name.localeCompare(b.name)); // Orden alfabético A-Z
                break;
            case 'alphabeticalZtoA':
                sortedCreatures = creatures.sort((a, b) => b.name.localeCompare(a.name)); // Orden alfabético Z-A
                break;
            case 'hitpoints':
                sortedCreatures = creatures.sort((a, b) => a.hitpoints - b.hitpoints); // Ordenar por puntos de vida
                break;
            case 'experience':
                sortedCreatures = creatures.sort((a, b) => b.experience - a.experience);
                break;
            default:
                sortedCreatures = creatures;
                break;
        }
    
        // Mostrar criaturas ordenadas
        displayCreatures(sortedCreatures);
    });


    // Asignamos el evento de clic a cada card
    document.getElementById("creaturesContainer").addEventListener('click', (event) => {
        const card = event.target.closest('.creature-card'); // Verifica si fue una tarjeta
        if (!card) return;
    
        const race = card.querySelector('.creature-image').getAttribute('data-race');
        console.log("Obteniendo datos de:", race);
    
        // Ocultar lista y mostrar sección de datos
        document.getElementById("creaturesContainer").style.display = "none";
        const creatureDataSection = document.querySelector(".creature-data");
        creatureDataSection.style.display = "block";
    
        // Obtener y mostrar los datos de la criatura
        fetchCreatureData(race);
    });

    // Función para cerrar la sección de datos de la criatura
    document.querySelector(".close-creature").addEventListener('click', () => {
        document.querySelector(".creature-data").style.display = "none";
        const mainTable = document.getElementById("mainTable");
        const secondaryTable = document.getElementById("secondaryTable");
        mainTable.innerHTML = "";
        secondaryTable.innerHTML = "";
        const creatureNameElement = document.getElementById("creatureName");
        creatureNameElement.textContent = "";
        const creatureImageElement = document.getElementById("creatureImage");
        creatureImageElement.style.display = "none";

        document.getElementById("creaturesContainer").style.display = "grid";
    });
    

});