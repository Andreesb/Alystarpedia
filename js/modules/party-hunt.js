export function setupHuntSessionProcessor(buttonId, inputId, resultContainerId) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    const resultContainer = document.getElementById(resultContainerId);
    const historialList = document.getElementById("historial-list");

    if (!button || !input || !resultContainer || !historialList) {
        console.error("Error: No se encontraron los elementos necesarios en el DOM.");
        return;
    }

    // Inicializar historial desde localStorage
    updateHistorialUI();

    button.addEventListener("click", () => {
        const sessionData = input.value;
        const result = processHuntSession(sessionData);

        if (result.errors.length > 0) {
            resultContainer.innerHTML = `<p id="party-error" style="color: red;">${result.errors.join("<br>")}</p>`;
        } else {
            // Renderizar la sesión procesada
            renderSession(result, resultContainer);

            // Guardar en el historial
            saveToHistorial(result);

            // Actualizar la UI del historial
            updateHistorialUI();
        }
    });

    function saveToHistorial(session) {
        const { huntDate, players } = session;

        // Crear un nombre para el slot
        const slotName = players.slice(0, 4).map(p => p.name).join(", ");

        // Crear un objeto para almacenar
        const sessionData = {
            huntDate,
            players,
            session,
            timestamp: Date.now()
        };

        // Leer historial desde localStorage
        let historial = JSON.parse(localStorage.getItem("partyHistorial")) || [];

        // Agregar nueva sesión al principio
        historial.unshift(sessionData);

        // Limitar a 3 sesiones
        historial = historial.slice(0, 3);

        // Guardar en localStorage
        localStorage.setItem("partyHistorial", JSON.stringify(historial));
    }

    function updateHistorialUI() {
        // Leer historial desde localStorage
        const historial = JSON.parse(localStorage.getItem("partyHistorial")) || [];

        // Limpiar la lista actual
        historialList.innerHTML = "";

        // Crear elementos para cada slot
        historial.forEach((slot, index) => {
            const li = document.createElement("button");
            li.textContent = `${slot.players.slice(0, 4).map(p => p.name).join(" - ")}`;
            li.classList.add("visible");
            li.dataset.index = index;
            

            // Agregar evento para mostrar sesión al hacer clic
            li.addEventListener("click", () => showHistorialSession(index));
            historialList.appendChild(li);
        });
    }

    function showHistorialSession(index) {
        // Leer historial desde localStorage
        const historial = JSON.parse(localStorage.getItem("partyHistorial")) || [];

        // Obtener la sesión seleccionada
        const session = historial[index]?.session;

        if (session) {
            // Renderizar la sesión seleccionada
            renderSession(session, resultContainer);
        } else {
            console.error("Error: Sesión no encontrada.");
        }
    }

    function renderSession(session, container) {
        const {
            huntDate,
            startTime,
            endTime,
            lootTotal,
            lootPerHour,
            profitPerPlayer,
            transfers,
            players
        } = session;

        let html = `
            <section id="party-data">
                <h2>Party Session</h2>
                <p><b>Date:</b> ${huntDate}</p>
                <p><b>Start:</b> ${startTime}</p>
                <p><b>End:</b> ${endTime}</p>
                <p><b>Total Loot:</b> ${lootTotal.toLocaleString()} gold</p>
                <p><b>Profit per Player:</b> ${profitPerPlayer.toLocaleString()} gold</p>
            </section>
            <section id="splitting-instructions">
                <h2>Splitting Instructions</h2>
                ${
                    transfers.length > 0
                        ? transfers
                            .map(
                                (transfer) =>
                                    `<p><b>${transfer}</b></p>`
                            )
                            .join("")
                        : `<p>No transfers needed. All balances are equal.</p>`
                }
            </section>
            <div>
                <div id="cards-container">
                    <div id="party-results">
                        ${players
                            .map(
                                (p) =>
                                    `<ul class="results-cards hidden">
                                        <h2>${p.name}:</h2><br>
                                        <li><b>Loot:</b><p>${p.loot.toLocaleString()}</p></li>
                                        <li><b>Supplies:</b><p> ${p.supplies.toLocaleString()}</p></li>
                                        <li><b>Balance:</b><p> ${p.balance.toLocaleString()}</p></li>
                                        <li><b>Damage:</b> <p>${((p.damage / players.reduce((sum, p) => sum + p.damage, 0)) * 100).toFixed(2)}%</p></li>
                                        <li><b>Healing:</b> <p>${((p.healing / players.reduce((sum, p) => sum + p.healing, 0)) * 100).toFixed(2)}%</p></li>
                                    </ul>`
                            )
                            .join("")}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        flipCards();
    }
}


function flipCards() {
    const cards = document.querySelectorAll(".results-cards");
    cards.forEach((card) => {
        if (card.classList.contains("visible")) {
            setTimeout(() => {
                card.classList.remove("visible");
                card.classList.add("rotate");
                console.log(card.classList);
            }, 100);
            setTimeout(() => {
                card.classList.add("visible");
                console.log(card);
            }, 100);

        } if (card.classList.contains("hidden")) {
            setTimeout(() => {
                card.classList.remove("hidden");
                card.classList.add("visible");
            }, 100);
        }
        
    });
}



function processHuntSession(sessionData) {
    const errors = [];
    if (!sessionData) {
        errors.push("Empty session.");
        return { errors };
    }

    // Regex para extraer información general
    const sessionTimeMatch = sessionData.match(/Session: (\d{2}:\d{2})h/);
    const huntDateMatch = sessionData.match(/From (\d{4}-\d{2}-\d{2}),/);
    const timeRangeMatch = sessionData.match(/\d{2}:\d{2}:\d{2}/g);
    const lootMatch = sessionData.match(/Loot: ([\d,]+)/);
    const suppliesMatch = sessionData.match(/Supplies: ([\d,]+)/);
    const balanceMatch = sessionData.match(/Balance: ([\d,-]+)/);

    if (!sessionTimeMatch || !huntDateMatch || !timeRangeMatch || !lootMatch || !suppliesMatch || !balanceMatch) {
        errors.push("Invalid data form.");
        return { errors };
    }

    // Conversión de datos generales
    const sessionTime = sessionTimeMatch[1];
    const huntDate = huntDateMatch[1];
    const [startTime, endTime] = timeRangeMatch;
    const lootTotal = parseInt(lootMatch[1].replace(/,/g, ""), 10);
    const totalSupplies = parseInt(suppliesMatch[1].replace(/,/g, ""), 10);
    const huntBalanceRaw = parseInt(balanceMatch[1].replace(/,/g, ""), 10);

    // Regex para extraer datos de los jugadores
    const playerRegex = /^([\w\s]+)(?: \(Leader\))?\n\s+Loot: ([\d,]+)\n\s+Supplies: ([\d,]+)\n\s+Balance: ([\d,-]+)\n\s+Damage: ([\d,]+)\n\s+Healing: ([\d,]+)/gm;
    const players = [];
    let match;
    while ((match = playerRegex.exec(sessionData)) !== null) {
        const [_, name, loot, supplies, balance, damage, healing] = match;
        players.push({
            name: name.trim(),
            loot: parseInt(loot.replace(/,/g, ""), 10),
            supplies: parseInt(supplies.replace(/,/g, ""), 10),
            balance: parseInt(balance.replace(/,/g, ""), 10),
            damage: parseInt(damage.replace(/,/g, ""), 10),
            healing: parseInt(healing.replace(/,/g, ""), 10),
        });
    }

    if (players.length === 0) {
        errors.push("No players found.");
        return { errors };
    }

    // Cálculo del profit total y profit por jugador
    const totalProfit = players.reduce((sum, p) => sum + p.balance, 0);
    const profitPerPlayer = Math.floor(totalProfit / players.length);

    // Cálculo de diferencias y transferencias
    const transfers = [];
    const balances = players.map((p) => ({
        name: p.name,
        balance: p.balance - profitPerPlayer, // Diferencia de cada jugador
    }));

    // Ordenar balances: acreedores (superávit) y deudores (déficit)
    const creditors = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);
    const debtors = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);

    while (debtors.length > 0 && creditors.length > 0) {
        const debtor = debtors[0];
        const creditor = creditors[0];

        const transferAmount = Math.min(Math.abs(debtor.balance), creditor.balance);

        transfers.push(`${creditor.name} transfer ${transferAmount.toLocaleString()} to ${debtor.name}`);

        debtor.balance += transferAmount;
        creditor.balance -= transferAmount;

        // Eliminar balances que ya estén saldados
        if (debtor.balance === 0) debtors.shift();
        if (creditor.balance === 0) creditors.shift();
    }

    return {
        errors,
        huntDate,
        startTime,
        endTime,
        lootTotal,
        totalProfit,
        profitPerPlayer,
        transfers,
        players,
    };
}
