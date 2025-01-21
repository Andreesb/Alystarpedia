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


document.getElementById("vocation").addEventListener("change", function () {
    const selectedVocation = this.value;
    const images = document.querySelectorAll(".vocation-image");

    images.forEach((image) => {
        if (image.dataset.select === selectedVocation) {
            image.classList.add("selected");
        } else {
            image.classList.remove("selected");
        }
    });
});


document.getElementById("calculateSkillButton").addEventListener("click", calculateSkills);

function calculateSkills() {
    const skillType = document.getElementById("skillType").value;
    const vocation = document.getElementById("skills-vocation").value;
    const currentSkill = parseInt(document.getElementById("currentSkill").value);
    const targetSkill = parseInt(document.getElementById("targetSkill").value);
    const progressPercent = parseInt(document.getElementById("skillProgress").value) || 0;
    const doubleSkillEvent = document.getElementById("doubleSkillEvent").checked;
    const privateDummy = document.getElementById("privateDummy").checked;
    const exerciseWeapon = document.getElementById("exerciseWeapon").value;
    const loyaltyBonus = parseInt(document.getElementById("loyaltyBonus").value) || 0;

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

    const exerciseWeapons = {
        durable: { charges: 1800, price: 1250000 },
        standard: { charges: 500, price: 347222 },
        lasting: { charges: 14400, price: 10000000 },
    };

    const A = skillConstants[skillType];
    const b = vocationConstants[vocation][skillType];
    const c = skillType === "magic-level" ? 0 : 10;

    if (!A || !b || currentSkill >= targetSkill) {
        document.getElementById("skillResult").innerText = "Invalid input. Please check your values.";
        return;
    }

    if ((skillType !== "magic-level" && currentSkill < 10) || progressPercent < 0 || progressPercent > 100) {
        document.getElementById("skillResult").innerText = "Invalid data. Check skill level or progress percentage.";
        return;
    }

    const loyaltyMultiplier = 1 + loyaltyBonus / 100; // Aplicar el bono de lealtad

    // Calcular puntos restantes para el nivel actual
    const pointsToNextLevel = A * Math.pow(b, currentSkill - c);
    const partialPoints = pointsToNextLevel * ((100 - progressPercent) / 100);

    // Calcular puntos totales para niveles superiores
    let totalPoints = partialPoints;
    for (let skill = currentSkill + 1; skill < targetSkill; skill++) {
        totalPoints += A * Math.pow(b, skill - c);
    }

    // Tiempo y cargas necesarias
    const timePerCharge = 2; // Cada carga dura 2 segundos
    let chargesNeeded = totalPoints / (7.2 * loyaltyMultiplier); // Tasa base ajustada por el bono de lealtad
    if (skillType === "distance") {
        chargesNeeded = totalPoints / (3.6 * loyaltyMultiplier);
    } else if (skillType === "magic-level") {
        chargesNeeded = totalPoints / (600 * loyaltyMultiplier);
    }

    // Ajustes por eventos o configuraciones
    if (doubleSkillEvent) {
        chargesNeeded /= 2;
    }

    if (privateDummy) {
        chargesNeeded *= 0.9;
    }

    const totalCharges = Math.ceil(chargesNeeded);

    // Detalles del arma de entrenamiento
    const weaponDetails = exerciseWeapons[exerciseWeapon];
    const weaponsNeeded = Math.ceil(totalCharges / weaponDetails.charges);
    const totalCost = weaponsNeeded * weaponDetails.price;

    // Formato del tiempo: días, horas, minutos
    const timeInSeconds = chargesNeeded * timePerCharge;
    const totalHours = Math.floor(timeInSeconds / 3600);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    const timeFormatted =
        days > 0
            ? `${days} days ${hours}h ${minutes}m`
            : totalHours > 0
            ? `${hours}h ${minutes}m`
            : minutes > 0
            ? `${minutes}m`
            : `${seconds}s`;
    

    // Formato del costo en "kk" y "kkk"
    const formatCost = (cost) => {
        if (cost >= 1e9) {
            return (cost / 1e9).toFixed(1) + "kkk";
        } else if (cost >= 1e6) {
            return (cost / 1e6).toFixed(1) + "kk";
        }
        return cost.toLocaleString("en-US");
    };

    // Mostrar resultados
    document.getElementById("skillResult").innerHTML = `
        <p>Time required: ${timeFormatted}</p>
        <p>Charges needed: ${totalCharges.toLocaleString("en-US")}</p>
        <p>Weapons needed: ${weaponsNeeded.toLocaleString("en-US")}</p>
        <p>Total cost: ${formatCost(totalCost)}</p>
    `;
}


// Update progress label dynamically
document.getElementById("skillProgress").addEventListener("input", (event) => {
    document.getElementById("progressPercent").innerText = `${event.target.value}%`;
});


