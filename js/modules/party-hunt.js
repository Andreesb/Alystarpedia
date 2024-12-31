export function setupHuntSessionProcessor(buttonId, inputId, resultContainerId) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    const resultContainer = document.getElementById(resultContainerId);

    if (!button || !input || !resultContainer) {
        console.error("Error: No se encontraron los elementos necesarios en el DOM.");
        return;
    }

    button.addEventListener("click", () => {
        const sessionData = input.value;
        const result = processHuntSession(sessionData);

        if (result.errors.length > 0) {
            resultContainer.innerHTML = `<p id="party-error"; style="color: red;">${result.errors.join("<br>")}</p>`;
        } else {
            const { huntDate, startTime, endTime, lootPerHour, individualBalance, players } = result;

            let html = `
                <section id="party-data">
                    <h2>Party Session</h2>
                    <p><b>Date:</b> ${huntDate}</p>
                    <p><b>Start:</b> ${startTime}</p>
                    <p><b>End:</b> ${endTime}</p>
                    <p><b>Loot per Hour:</b> ${lootPerHour.toLocaleString()} gold</p>
                    <p><b>Personal Balance:</b> ${individualBalance.toLocaleString()} gold</p>
                </section>
                <div id="party-results">
                    ${players
                        .map(
                            (p) =>
                                `<ul class="party-results">
                                    <h5>${p.name}:</h5>
                                    <li>Loot: ${p.loot.toLocaleString()}</li>
                                    <li>Supplies: ${p.supplies.toLocaleString()}</li>
                                    <li>Balance: ${p.balance.toLocaleString()}</li>
                                    <li>Damage: ${p.damagePercent}%</li>
                                    <li>Healing: ${p.healingPercent}%</li>
                                </ul>`
                        )
                        .join("")}
                </div>
            `;

            resultContainer.innerHTML = html;
        }
    });
}

function processHuntSession(sessionData) {
    const errors = [];
    if (!sessionData) {
        errors.push("Empty session.");
        return { errors };
    }

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

    const sessionTime = sessionTimeMatch[1];
    const huntDate = huntDateMatch[1];
    const [startTime, endTime] = timeRangeMatch;
    const lootTotal = parseInt(lootMatch[1].replace(/,/g, ""), 10);
    const totalSupplies = parseInt(suppliesMatch[1].replace(/,/g, ""), 10);
    const huntBalanceRaw = parseInt(balanceMatch[1].replace(/,/g, ""), 10);

    const [hours, minutes] = sessionTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    const lootPerHour = Math.floor((lootTotal / totalMinutes) * 60);

    

    const playerRegex = /^([\w\s]+)(?: \(Leader\))?\n\s+Loot: ([\d,]+)\n\s+Supplies: ([\d,]+)\n\s+Balance: ([\d,-]+)\n\s+Damage: ([\d,]+)\n\s+Healing: ([\d,]+)/gm;
    const players = [];
    let match;
    while ((match = playerRegex.exec(sessionData)) !== null) {
        const [_, name, loot, supplies, balance, damage, healing] = match;
        players.push({
            name,
            loot: parseInt(loot.replace(/,/g, ""), 10),
            supplies: parseInt(supplies.replace(/,/g, ""), 10),
            balance: parseInt(balance.replace(/,/g, ""), 10),
            damage: parseInt(damage.replace(/,/g, ""), 10),
            healing: parseInt(healing.replace(/,/g, ""), 10),
        });
    }

    if (players.length === 0) {
        errors.push("Party are missed.");
        return { errors };
    }

    const totalPlayers = players.length;
    const individualBalance = Math.floor(huntBalanceRaw / totalPlayers);

    const totalDamage = players.reduce((sum, p) => sum + p.damage, 0);
    const totalHealing = players.reduce((sum, p) => sum + p.healing, 0);
    players.forEach((player) => {
        player.damagePercent = ((player.damage / totalDamage) * 100).toFixed(2);
        player.healingPercent = ((player.healing / totalHealing) * 100).toFixed(2);
    });

    return {
        errors,
        huntDate,
        startTime,
        endTime,
        lootPerHour,
        huntBalanceRaw,
        individualBalance,
        players,
    };
}
