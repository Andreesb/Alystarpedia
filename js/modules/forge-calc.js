// Example cost data
const costs = {
  fusion: {
    class1: [25000],
    class2: [750000, 5000000],
    class3: [4000000, 10000000, 20000000],
    class4: [8000000, 20000000, 40000000, 65000000, 100000000, 250000000, 750000000, 2500000000, 8000000000, 15000000000]
  },
  transfer: {
    class2: { 2: 5000000 },
    class3: { 2: 10000000, 3: 20000000 },
    class4: { 2: 20000000, 3: 40000000, 4: 65000000, 5: 100000000, 6: 250000000, 7: 750000000, 8: 2500000000, 9: 8000000000, 10: 15000000000 }
  },
  convergence_fusion: {
    class4: [55000000, 110000000, 170000000, 300000000, 875000000, 2350000000, 6950000000, 21250000000, 50000000000, 125000000000]
  },
  convergence_transfer: {
    class4: [65000000, 165000000, 375000000, 800000000, 2000000000, 5250000000, 14500000000, 42500000000, 100000000000, 300000000000]
  }
};

const img = {
  dust: "../assets/icons/dust.gif",
  exaltedCores: "../assets/icons/exalted-core.gif",
  sliver: "../assets/icons/sliver.gif",
  ccoins: "../assets/icons/crystalCoin.webp",
  item1: "../assets/media/toUse/heavily-armor.gif",
  item2: "../assets/media/toUse/rusted-armor.gif",
  item3: "../assets/media/toUse/slightly-armor.gif",
  item4: "../assets/media/toUse/mpa.gif",
  
}

function formatGoldNumber(number) {
  if (number >= 1e12) return `${(number / 1e12).toFixed(0)}T`;
  if (number >= 1e9) return `${(number / 1e9).toFixed(2)}KKKs`;
  if (number >= 1e6) return `${(number / 1e6).toFixed(1)}KKs`;
  if (number >= 1e3) return `${(number / 1e3).toFixed(1)}Ks`;
  return number.toLocaleString();
}

function getItemImage(itemClass) {
  switch(itemClass) {
    case "class1":
      return img.item1;
    case "class2":
      return img.item2;
    case "class3":
      return img.item3;
    case "class4":
      return img.item4;
    default:
      return img.item1;
  }
}

function calculateCosts() {
    const method = document.getElementById('method').value;
    const convergence = document.getElementById('convergenceCheck').checked;
    const currentTier = parseInt(document.getElementById('current-tier').value, 10);
  
    // Para métodos de fusión se necesita un target tier.
    let targetTier = null;
    if (document.getElementById('target-tier')) {
      targetTier = parseInt(document.getElementById('target-tier').value, 10);
    }
  
    const itemClass = document.getElementById('itemClass').value;
    let resultHtml = '';
  
    if (method === 'fusion') {
      if (isNaN(currentTier) || isNaN(targetTier) || targetTier <= currentTier || targetTier > 10 || currentTier < 0) {
        document.getElementById('forgeResults').innerText = 'Please enter valid tiers.';
        return;
      }
  
      // Seleccionar la tabla de costos adecuada
      const costData = convergence 
        ? costs.convergence_fusion[itemClass] 
        : costs.fusion[itemClass];
  
      if (!costData || targetTier > costData.length) {
        document.getElementById('forgeResults').innerText = 'Invalid classification or target tier.';
        return;
      }
      
      // Número de fusiones requeridas para pasar de currentTier a targetTier:
      const numLevels = targetTier - currentTier;
      const numFusions = 2 ** numLevels - 1;
      
      // Calcular Dust y Cores usando la fórmula teórica:
      const baseDust = convergence ? 130 : 100;
      const totalDust = baseDust * numFusions;
      const totalCores = numFusions; // Suponiendo 1 core por fusión
      const totalItems = 2 ** numLevels;
      
      // Calcular Gold usando la fórmula recursiva (como en tu código actual)
      let totalUpgradeCost = 0;
      for (let tier = currentTier; tier < targetTier; tier++) {
        totalUpgradeCost = totalUpgradeCost * 2 + costData[tier];
      }
      
      // Formatear números para mejor presentación
      const formattedGold = formatGoldNumber(totalUpgradeCost);
      const formattedDust = formatGoldNumber(totalDust);
      const formattedCores = formatGoldNumber(totalCores);
      const formattedItems = formatGoldNumber(totalItems);

      // Determina la imagen del ítem final
      const finalItemImage = getItemImage(itemClass);
      
      resultHtml = `
        <br>
        <h3>Costs for upgrading from Tier ${currentTier} to Tier ${targetTier} (${convergence ? 'Convergence Fusion' : 'Fusion'}):</h3>
        <p>Gold: ${formattedGold}<img class="forge-image" src="${img.ccoins}" title="Crystal Coins" alt="Crystal Coins"></p>
        <p>Dust: ${formattedDust}<img class="forge-image" src="${img.dust}" title="Dust" alt="Dust"></p>
        <p>Exalted Cores: ${formattedCores} <img class="forge-image" src="${img.exaltedCores}" title="Exalted Core" alt="Exalted Cores"></p>
        <p>Items Required: ${formattedItems}<img class="forge-image" src="${finalItemImage}" title="Final Item" alt="Final Item"></p>
      `;
    } else if (method === 'transfer') {
      // Lógica para Transfer (no se modifica en este ejemplo)
      const costData = convergence 
        ? costs.convergence_transfer[itemClass] 
        : costs.transfer[itemClass];
        
      if (!costData) {
        alert("Transfer is not available for this classification.");
        return;
      }
      
      const goldCost = costData[currentTier];
        
      if (!goldCost) {
        alert("Transfer cost not available for this tier.");
        return;
      }
      
      const exaltedCoresRequired = {
        2: 1, 3: 2, 4: 5, 5: 10, 6: 15, 7: 20, 8: 25, 9: 30, 10: 35
      };
      const exaltedCores = exaltedCoresRequired[currentTier] || "Unknown";
      const dustRequired = convergence ? 160 : 100;
      
      resultHtml = `
        <br>
        <h3>${convergence ? 'Convergence Transfer' : 'Transfer'} Results:</h3>
        <p><strong>New Tier:</strong> ${currentTier - 1}</p>
        <p><strong>Gold Required:</strong> ${formatGoldNumber(goldCost)} <img class="forge-image" src="${img.ccoins}" title="Crystal Coins" alt="Crystal Coins"></p>
        <p><strong>Exalted Cores Required:</strong> ${exaltedCores}<img class="forge-image" src="${img.exaltedCores}" title="Exalted Core" alt="Exalted Cores"></p>
        <p><strong>Dust Required:</strong> ${dustRequired}<img class="forge-image" src="${img.dust}" title="Dust" alt="Dust"></p>
        <p><strong>Original item will be destroyed!</strong></p>
      `;
    } else {
      resultHtml = '<p>Invalid forge method.</p>';
    }
    
    document.getElementById('forgeResults').innerHTML = resultHtml;
  }
  

document.getElementById('calculateForge').addEventListener('click', calculateCosts);

// Optional: If you want to show/hide target-tier field depending on the method,
// you can add an event listener on the 'method' selector.
document.getElementById('method').addEventListener('change', (e) => {
  const method = e.target.value;
  const targetTierContainer = document.getElementById('targetTierContainer');
  // For Transfer, you might not need a target tier input.
  if (method === 'transfer' || method === 'convergence-transfer') {
    targetTierContainer.style.display = 'none';
  } else {
    targetTierContainer.style.display = 'block';
  }
});
