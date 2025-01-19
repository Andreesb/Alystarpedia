// Función para calcular la experiencia total requerida para llegar a un nivel
function experienceForLevel(level) {
    return 50 * Math.pow(level, 2) - 150 * level + 200;
}

// Función para calcular la experiencia faltante y estadísticas basadas en la vocación
function calculateStatsAndExp(vocation, currentLevel, desiredLevel) {
    if (currentLevel >= desiredLevel) {
        return "El nivel actual debe ser menor que el nivel deseado.";
    } if (isNaN(currentLevel) || isNaN(desiredLevel)) {
        alert("Por favor, ingresa valores válidos en todos los campos.");
        return;
    }


    // Calcular experiencia faltante
    let totalExperience = 0;
    for (let level = currentLevel; level < desiredLevel; level++) {
        totalExperience += experienceForLevel(level);
    }

    // Calcular rango para compartir experiencia
    const shareExpMin = Math.floor((desiredLevel * 2) / 3);
    const shareExpMax = Math.floor((desiredLevel * 3) / 2);

    // Calcular estadísticas según la vocación
    let stats = {
        hp: 185,
        mana: 40,
        capacity: 470,
        totalExperience,
        shareExpRange: {
            min: shareExpMin,
            max: shareExpMax
        }
    };

    const levelsGained = desiredLevel - 8;

    switch (vocation.toLowerCase()) {
        case "knight":
            stats.hp += 15 * (desiredLevel - 8);
            stats.mana += 5 * (desiredLevel - 8);
            stats.capacity += 25 * (desiredLevel - 8);
            break;

        case "paladin":
            stats.hp += 10 * (desiredLevel - 8);
            stats.mana += 15 * (desiredLevel - 8);
            stats.capacity += 20 * (desiredLevel - 8);
            break;

        case "sorcerer":
        case "druid":
            stats.hp += 5 * (desiredLevel - 8);
            stats.mana += 30 * (desiredLevel - 8);
            stats.capacity += 10 * (desiredLevel - 8);
            break;

        default:
            return "Vocación no válida. Elija entre Knight, Paladin, Sorcerer o Druid.";
    }

    return stats;
}

// Función para manejar el cálculo y mostrar los resultados
function handleCalculation() {
    // Obtener valores del formulario
    const vocation = document.getElementById("vocation").value;
    const currentLevel = parseInt(document.getElementById("currentLevel").value, 10);
    const desiredLevel = parseInt(document.getElementById("desiredLevel").value, 10);

    // Calcular estadísticas y experiencia faltante
    const result = calculateStatsAndExp(vocation, currentLevel, desiredLevel);

    // Mostrar resultados
    const resultElement = document.getElementById("result");
    if (typeof result === "string") {
        resultElement.textContent = result; // Mostrar errores o advertencias
    } else {
        resultElement.innerHTML = `
            <p><b>Resultados para ${vocation}:</b></p>
            <ul>
                <li><b>Experiencia faltante:</b> ${result.totalExperience.toLocaleString()}</li>
                <li><b>Vida (HP) al nivel ${desiredLevel}:</b> ${result.hp}</li>
                <li><b>Mana al nivel ${desiredLevel}:</b> ${result.mana}</li>
                <li><b>Capacidad (Cap) al nivel ${desiredLevel}:</b> ${result.capacity}</li>
                <li><b>Rango para compartir experiencia:</b> ${result.shareExpRange.min} - ${result.shareExpRange.max}</li>
            </ul>
        `;
    }
}

// Evento para calcular al hacer clic en el botón
document.getElementById("calculateLevel").addEventListener("click", handleCalculation);

document.getElementById("calculateSkillButton").addEventListener("click", calculateSkills);

function calculateSkills() {
    const skillType = document.getElementById("skillType").value;
    const vocation = document.getElementById("skills-vocation").value;
    const currentSkill = parseInt(document.getElementById("currentSkill").value);
    const targetSkill = parseInt(document.getElementById("targetSkill").value);
    const progressPercent = parseInt(document.getElementById("skillProgress").value);
    const doubleSkillEvent = document.getElementById("doubleSkillEvent").checked;

    const skillConstants = {
        "magic-level": 1600,
        melee: 50,
        distance: 30,
        shielding: 100,
        fishing: 20,
    };

    const vocationConstants = {
        None: { "magic-level": 3.0, melee: 2.0, distance: 2.0, shielding: 1.5, fishing: 1.1 },
        Knight: { "magic-level": 3.0, melee: 1.1, distance: 1.4, shielding: 1.1, fishing: 1.1 },
        Paladin: { "magic-level": 1.4, melee: 1.2, distance: 1.1, shielding: 1.1, fishing: 1.1 },
        Sorcerer: { "magic-level": 1.1, melee: 2.0, distance: 2.0, shielding: 1.5, fishing: 1.1 },
        Druid: { "magic-level": 1.1, melee: 1.8, distance: 1.8, shielding: 1.5, fishing: 1.1 },
    };

    const A = skillConstants[skillType];
    const b = vocationConstants[vocation][skillType];
    const c = skillType === "magic-level" ? 0 : 10;

    if (!A || !b || currentSkill >= targetSkill) {
        document.getElementById("skillResult").innerText = "Invalid input. Please check your values.";
        return;
    }

    let totalPoints = 0;
    for (let skill = currentSkill; skill < targetSkill; skill++) {
        const pointsToNextLevel = A * Math.pow(b, skill - c);
        totalPoints += pointsToNextLevel;
    }

    // Adjust for progress percentage
    const remainingPoints = totalPoints * (1 - progressPercent / 100);

    // Time calculation (seconds)
    const timePerCharge = 2; // Each charge is used every 2 seconds
    let chargesNeeded = remainingPoints / 7.2; // Default for melee; adjust for other types
    if (skillType === "distance") {
        chargesNeeded = remainingPoints / 3.6;
    } else if (skillType === "magic-level") {
        chargesNeeded = remainingPoints / 600;
    }

    // Adjust for double skill event
    if (doubleSkillEvent) {
        chargesNeeded /= 2;
    }

    const timeInSeconds = chargesNeeded * timePerCharge;

    // Convert to hours, minutes, seconds
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    // Display result
    document.getElementById("skillResult").innerHTML = `
        <strong><p>Time required: ${hours}h ${minutes}m ${seconds}s</p>
        <p>Charges needed: ${Math.ceil(chargesNeeded)}</p><strong>
    `;
}

// Update progress label dynamically
document.getElementById("skillProgress").addEventListener("input", (event) => {
    document.getElementById("progressPercent").innerText = `${event.target.value}%`;
});

