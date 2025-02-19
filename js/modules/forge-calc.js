const costs = {
    fusion: {
        class1: [25000],
        class2: [750000, 5000000],
        class3: [4000000, 10000000, 20000000],
        class4: [8000000, 20000000, 40000000, 65000000, 100000000, 250000000, 750000000, 2500000000, 8000000000, 15000000000]
    },
    transfer:{
        class2: { 2: 5000000 },
        class3: { 2: 10000000, 3: 20000000 },
        class4: { 2: 20000000, 3: 40000000, 4: 65000000, 5: 100000000, 6: 250000000, 7: 750000000, 8: 2500000000, 9: 8000000000, 10: 15000000000 }
    } ,
    convergence_fusion: {
        class4: [55000000, 110000000, 170000000, 300000000, 875000000, 2350000000, 6950000000, 21250000000, 50000000000, 125000000000]
    },
    convergence_transfer: {
        class4: [65000000, 165000000, 375000000, 800000000, 2000000000, 5250000000, 14500000000, 42500000000, 100000000000, 300000000000]
    },

};

const transferCosts = {
    "class2": { 2: 5000000 },
    "class3": { 2: 10000000, 3: 20000000 },
    "class4": { 2: 20000000, 3: 40000000, 4: 65000000, 5: 100000000, 6: 250000000, 7: 750000000, 8: 2500000000, 9: 8000000000, 10: 15000000000 }
};


function formatGoldNumber(number) {
    if (number >= 1e12) return `${(number / 1e12).toFixed(0)}T`;
    if (number >= 1e9) return `${(number / 1e9).toFixed(2)}KKKs`;
    if (number >= 1e6) return `${(number / 1e6).toFixed(1)}KKs`;
    return number.toLocaleString();
}

function calculateCosts() {
    const currentTier = parseInt(document.getElementById('current-tier').value, 10);
    const targetTier = parseInt(document.getElementById('target-tier').value, 10);
    const fusionClass = document.getElementById('fusionClass').value;
    const transferTier = parseInt(document.getElementById('transfer-tier').value, 10);
    const transferClass = document.getElementById('transferClass').value;
    const converFusionClass = document.getElementById('conver-fusionClass').value;
    const converFusionTier = parseInt(document.getElementById('conver-fusionTier').value, 10);
    const converFusionTarget = parseInt(document.getElementById('conver-fusionTarget').value, 10);
    const converTransfer = document.getElementById('convergence-transfer-tier').value;
    const forgeMethod = document.getElementById('method').value;

    if (forgeMethod === 'fusion') {
        
        
            if (isNaN(currentTier) || isNaN(targetTier) || targetTier <= currentTier || targetTier > 10 || currentTier < 0) {
                document.getElementById('fusionResults').innerText = 'Please enter valid tiers.';
                return;
            }
        
            const classCosts = costs.fusion[fusionClass];
            if (!classCosts || targetTier > classCosts.length) {
                document.getElementById('fusionResults').innerText = 'Invalid classification or target tier.';
                return;
            }
        
            let totalUpgradeCost = 0; // Inicializa con el costo base del primer tier
        
        
            // Otros cálculos relacionados (ítems, dust, cores, etc.)
            let totalDust = 100; // Base dust
            let totalCores = 2;  // Base cores
            let totalItems = 2;
            
            if (targetTier == 1){
                totalItems = 2
                totalCores = 1
        
            } else {
                totalItems = 2 ** (targetTier);
                totalCores = 2;
            };
        
        
            for (let tier = currentTier; tier < targetTier; tier++) {
                totalUpgradeCost = totalUpgradeCost * 2 + classCosts[tier];
                totalCores = totalCores * 2 + 2;
                totalDust = totalDust * 2 + 100;
                totalItems = 2 ** (tier + 1);
            }
        
            // Formatear los números para una mejor presentación
            const formattedGold = formatGoldNumber(totalUpgradeCost);
            const formattedDust = formatGoldNumber(totalDust);
            const formattedCores = formatGoldNumber(totalCores);
            const formattedItems = formatGoldNumber(totalItems);
            let resultHtml = '';
        
            if (targetTier == 1){
                resultHtml = `
                <h3>Costs for upgrading from Tier ${currentTier} to Tier ${targetTier}:</h3>
                <p>Gold: ${formattedGold}</p>
                <p>Dust: ${formattedDust}</p>
                <p>Cores: ${formattedCores}
                    <p style= "color: green;">For Tier 1, you don't need use the secure for Tier Loss core</p>
                </p>
                
                <p>Items Required: ${formattedItems}</p>
            `;
                
        
            } else {
                resultHtml = `
                    <h3>Costs for upgrading from Tier ${currentTier} to Tier ${targetTier}:</h3>
                    <p>Gold: ${formattedGold}</p>
                    <p>Dust: ${formattedDust}</p>
                    <p>Cores: ${formattedCores}</p>
                    <p>Items Required: ${formattedItems}</p>
                `;
            }
        
            document.getElementById('fusionResults').innerHTML = resultHtml;

        } if (forgeMethod === 'transfer') {
            // Exalted Cores requeridos por Tier
            const exaltedCoresRequired = {
                2: 1, 3: 2, 4: 5, 5: 10, 6: 15, 7: "?", 8: "?", 9: "?", 10: "?"
            };

            const targetTier = transferTier - 1;
            const goldCost = costs?.transfer?.[transferClass]?.[transferTier] ?? "Not Available";;
            const exaltedCores = exaltedCoresRequired[transferTier] || "Unknown";
            const dustRequired = 100; // Siempre 100 Dust

            if (goldCost === "Not Available") {
                alert("Transfer is not available for this classification and tier.");
                return;
            }

            // Mostrar resultados
            document.getElementById("transferResults").innerHTML = `
                <h3>Transfer Results</h3>
                <p><strong>New Tier:</strong> ${targetTier}</p>
                <p><strong>Gold Required:</strong> ${goldCost.toLocaleString()} Gold</p>
                <p><strong>Exalted Cores Required:</strong> ${exaltedCores}</p>
                <p><strong>Dust Required:</strong> ${dustRequired}</p>
                <p><strong>Original item will be destroyed!</strong></p>
            `;



        } if (forgeMethod === 'convergence-fusion') {
            if (isNaN(converFusionTier) || isNaN(converFusionTarget) || converFusionTarget <= converFusionTier || converFusionTarget > 10 || converFusionTier < 0) {
                document.getElementById('conver-fusionResults').innerText = 'Please enter valid tiers.';
                return;
            }
        
            const classCosts = costs.convergence_fusion[converFusionClass];
            if (!classCosts || converFusionTarget > classCosts.length) {
                document.getElementById('conver-fusionResults').innerText = 'Invalid classification or target tier.';
                return;
            }
        
            let totalUpgradeCost = classCosts[0]; // Inicializa con el costo base del primer tier
        
            if (converFusionTarget > 1) {
                totalUpgradeCost = classCosts[0] * 2 + classCosts[1];
                for (let tier = 1; tier < converFusionTarget - 1; tier++) {
                    totalUpgradeCost = totalUpgradeCost * 2 + classCosts[tier + 1];
                }
            }
        
            // Otros cálculos relacionados (ítems, dust, cores, etc.)
            let totalDust = 130; // Base dust
            let totalCores = 2;  // Base cores
            

            for (let tier = converFusionTier; tier < converFusionTarget; tier++) {
                totalUpgradeCost = totalUpgradeCost * 2 + classCosts[tier];
                totalCores = totalCores * 2 + 2;
                totalDust = totalDust * 2 + 130;
            }
        
            // Formatear los números para una mejor presentación
            const formattedGold = formatGoldNumber(totalUpgradeCost);
            const formattedDust = formatGoldNumber(totalDust);


            document.getElementById("conver-fusionResults").innerHTML = `
            <h3>Costs for upgrading from Tier ${converFusionTier} to Tier ${converFusionTarget}:</h3>
            <p>Gold: ${formattedGold}</p>
            <p>Dust: ${formattedDust}</p>
            
            `;
            
        } if (forgeMethod === 'convergence-transfer') {
            // Exalted Cores requeridos por Tier
            const exaltedCoresRequired = {
                1:1, 2: 2, 3: 5, 4: 10, 5: 15, 6: 25, 7: 35, 8: 50, 9: 60, 10: 85
            };


            const goldCost = costs?.transfer?.[transferClass]?.[transferTier] ?? "Not Available";
            const exaltedCores = exaltedCoresRequired[transferTier] || "Unknown";
            const dustRequired = 160; // Siempre 100 Dust

            if (goldCost === "Not Available") {
                alert("Transfer is not available for this classification and tier.");
                return;
            }

            // Mostrar resultados
            document.getElementById("transferResults").innerHTML = `
                <h3>Transfer Results</h3>
                <p><strong>New Tier:</strong> ${targetTier}</p>
                <p><strong>Gold Required:</strong> ${goldCost.toLocaleString()} Gold</p>
                <p><strong>Exalted Cores Required:</strong> ${exaltedCores}</p>
                <p><strong>Dust Required:</strong> ${dustRequired}</p>
                <p><strong>Original item will be destroyed!</strong></p>
            `;



        }
        else {
        document.getElementById('forgeResults').innerText = 'Invalid forge method.';
    }
}


document.getElementById('calculateForge').addEventListener('click', calculateCosts);
