// ============================================================
// PROJECT RESURGENCE: THE SILENT ZONE — UI Manager
// ============================================================

const UI = {
  currentScreen: "title",
  encounterState: null,

  init() {
    this.bindNavigation();
    this.bindTitleScreen();
    if (Storage.hasSave()) {
      document.getElementById("btn-continue").style.display = "block";
    }
  },

  bindNavigation() {
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const screen = btn.dataset.screen;
        if (screen && GameEngine.state && !GameEngine.state.gameOver) {
          this.showScreen(screen);
        }
      });
    });
  },

  bindTitleScreen() {
    document.getElementById("btn-new-life").addEventListener("click", () => {
      GameEngine.newGame();
      this.showCharacterReveal();
    });
    const continueBtn = document.getElementById("btn-continue");
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        if (GameEngine.loadGame()) {
          document.getElementById("title-screen").classList.add("hidden");
          document.getElementById("game-container").classList.remove("hidden");
          this.showScreen("dashboard");
        }
      });
    }
  },

  showScreen(screenId) {
    this.currentScreen = screenId;
    document.querySelectorAll(".game-screen").forEach(s => s.classList.remove("active"));
    const screen = document.getElementById(`screen-${screenId}`);
    if (screen) {
      screen.classList.add("active");
      screen.style.animation = "fadeIn 0.3s ease";
    }
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    const navItem = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
    if (navItem) navItem.classList.add("active");
    this.updateTopBar();
    switch (screenId) {
      case "dashboard": this.renderDashboard(); break;
      case "shelter": this.renderShelter(); break;
      case "scavenge": this.renderScavenge(); break;
      case "character": this.renderCharacter(); break;
      case "log": this.renderLog(); break;
      case "inventory": this.renderInventory(); break;
    }
  },

  updateTopBar() {
    if (!GameEngine.state) return;
    const s = GameEngine.state;
    const c = s.character;
    document.getElementById("top-day").textContent = `Day ${s.day}`;
    document.getElementById("top-ap").textContent = `${s.ap}/${s.maxAP} AP`;
    this.updateBar("bar-health", c.health, c.maxHealth);
    this.updateBar("bar-hunger", c.hunger, c.maxHunger);
    this.updateBar("bar-thirst", c.thirst, c.maxThirst);
    this.updateBar("bar-sanity", c.sanity, c.maxSanity);
    this.updateBar("bar-infection", c.infection, 100);
    ["health", "hunger", "thirst", "sanity"].forEach(stat => {
      const bar = document.getElementById(`bar-${stat}`);
      const val = c[stat] !== undefined ? c[stat] : c.stats[stat];
      const max = c[`max${stat.charAt(0).toUpperCase() + stat.slice(1)}`] || 100;
      if (bar) bar.closest(".stat-bar-container").classList.toggle("critical", val / max < 0.25);
    });
    const infBar = document.getElementById("bar-infection");
    if (infBar) infBar.closest(".stat-bar-container").classList.toggle("critical", c.infection > 50);
  },

  updateBar(id, current, max) {
    const bar = document.getElementById(id);
    if (!bar) return;
    const pct = Math.max(0, Math.min(100, (current / max) * 100));
    bar.style.width = `${pct}%`;
    const label = bar.closest(".stat-bar-container").querySelector(".bar-label");
    if (label) label.textContent = `${Math.round(current)}/${max}`;
  },

  showCharacterReveal() {
    const c = GameEngine.state.character;
    document.getElementById("title-screen").classList.add("hidden");
    const reveal = document.getElementById("character-reveal");
    reveal.classList.remove("hidden");
    document.getElementById("reveal-name").textContent = c.name;
    document.getElementById("reveal-details").textContent = `${c.age} years old · ${c.sex} · ${c.profession}`;
    document.getElementById("reveal-flavor").textContent = c.professionFlavor;
    document.getElementById("reveal-str").textContent = c.stats.strength;
    document.getElementById("reveal-dex").textContent = c.stats.dexterity;
    document.getElementById("reveal-end").textContent = c.stats.endurance;
    document.getElementById("reveal-int").textContent = c.stats.intelligence;
    const itemsList = document.getElementById("reveal-items");
    itemsList.innerHTML = "";
    c.inventory.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.name;
      itemsList.appendChild(li);
    });
    document.getElementById("btn-begin").addEventListener("click", () => {
      reveal.classList.add("hidden");
      document.getElementById("game-container").classList.remove("hidden");
      this.showScreen("dashboard");
    }, { once: true });
  },

  // ── Dashboard ─────────────────────────────────────────────
  renderDashboard() {
    const s = GameEngine.state;
    const c = s.character;
    const dash = document.getElementById("dashboard-content");
    const tier = Character.getMutationTier(c);
    const mutationHtml = tier ? `
      <div class="mutation-alert tier-${Math.floor(c.infection / 25)}">
        <span class="mutation-icon">${icon('virus')}</span>
        <div>
          <strong>${tier.name}</strong>
          <p>${tier.description}</p>
        </div>
      </div>` : "";

    const equippedWeapon = Character.getEquippedWeapon(c);
    dash.innerHTML = `
      <div class="dashboard-grid">
        <div class="dash-card">
          <h3>${icon('chartBar')} Status</h3>
          <div class="stat-row"><span>Health</span><span class="stat-val ${c.health < 30 ? 'text-danger' : ''}">${c.health}/${c.maxHealth}</span></div>
          <div class="stat-row"><span>Hunger</span><span class="stat-val ${c.hunger < 20 ? 'text-danger' : ''}">${c.hunger}/${c.maxHunger}</span></div>
          <div class="stat-row"><span>Thirst</span><span class="stat-val ${c.thirst < 20 ? 'text-danger' : ''}">${c.thirst}/${c.maxThirst}</span></div>
          <div class="stat-row"><span>Sanity</span><span class="stat-val ${c.sanity < 25 ? 'text-danger' : ''}">${c.sanity}/${c.maxSanity}</span></div>
          <div class="stat-row"><span>Infection</span><span class="stat-val ${c.infection > 50 ? 'text-danger' : ''}">${c.infection}%</span></div>
          <div class="stat-row"><span>${icon('crosshair')} Weapon</span><span class="stat-val">${equippedWeapon ? equippedWeapon.name + ' (+' + equippedWeapon.combatBonus + ')' : '<span class="text-danger">None</span>'}</span></div>
        </div>
        <div class="dash-card">
          <h3>${icon('house')} Shelter</h3>
          <div class="stat-row"><span>Windows Patched</span><span class="stat-val">${s.shelter.windowsPatched}/${s.shelter.maxWindows}</span></div>
          <div class="stat-row"><span>Raid Risk</span><span class="stat-val ${s.shelter.raidRisk > 40 ? 'text-warning' : ''}">${s.shelter.raidRisk}%</span></div>
          <div class="stat-row"><span>Upgrades Built</span><span class="stat-val">${Object.keys(s.shelter.upgrades).length}</span></div>
        </div>
        <div class="dash-card">
          <h3>${icon('box')} Resources</h3>
          <div class="stat-row"><span>Scrap</span><span class="stat-val">${Character.getResourceCount(c, "scrap")}</span></div>
          <div class="stat-row"><span>Wood</span><span class="stat-val">${Character.getResourceCount(c, "wood")}</span></div>
          <div class="stat-row"><span>Cloth</span><span class="stat-val">${Character.getResourceCount(c, "cloth")}</span></div>
          <div class="stat-row"><span>Nails</span><span class="stat-val">${Character.getResourceCount(c, "nails")}</span></div>
          <div class="stat-row"><span>Rope</span><span class="stat-val">${Character.getResourceCount(c, "rope")}</span></div>
          <div class="stat-row"><span>Tape</span><span class="stat-val">${Character.getResourceCount(c, "tape")}</span></div>
        </div>
        <div class="dash-card dash-actions">
          <h3>${icon('lightning')} Quick Actions (AP: ${s.ap})</h3>
          <button class="action-btn" onclick="UI.doAction('rest')" ${s.ap < 8 ? 'disabled' : ''}>
            <span>${icon('moon')} Rest</span> <span class="ap-cost">8 AP</span>
          </button>
          <button class="action-btn" onclick="UI.doAction('clean')" ${s.ap < 4 ? 'disabled' : ''}>
            <span>${icon('tools')} Clean Debris</span> <span class="ap-cost">4 AP</span>
          </button>
          <button class="action-btn end-day-btn" onclick="UI.doAction('endDay')">
            <span>${icon('moonStars')} End Day</span>
          </button>
        </div>
      </div>
      ${mutationHtml}
      <div class="recent-log">
        <h3>${icon('clock')} Recent Events</h3>
        <div id="recent-log-entries"></div>
      </div>
    `;
    const logDiv = document.getElementById("recent-log-entries");
    const recentLogs = s.log.slice(-5).reverse();
    recentLogs.forEach(entry => {
      const p = document.createElement("p");
      p.className = "log-entry";
      p.textContent = entry.text;
      logDiv.appendChild(p);
    });
  },

  doAction(action) {
    let result;
    switch (action) {
      case "rest": result = GameEngine.rest(); break;
      case "clean": result = GameEngine.cleanDebris(); break;
      case "endDay":
        if (GameEngine.state.ap > 0) {
          this.showConfirmModal(
            'End the day early?',
            `You still have <strong>${GameEngine.state.ap}</strong> AP remaining. Unused action points will be lost. Are you sure?`,
            () => {
              GameEngine.endDay();
              if (GameEngine.state.gameOver) { this.showGameOver(); return; }
              this.showScreen("dashboard");
              this.showToast("A new day begins. 24 AP restored.", "info");
            }
          );
          return;
        }
        GameEngine.endDay();
        if (GameEngine.state.gameOver) { this.showGameOver(); return; }
        this.showScreen("dashboard");
        this.showToast("A new day begins. 24 AP restored.", "info");
        return;
    }
    if (result && !result.success) {
      this.showToast(result.reason, "error");
    } else if (result) {
      this.showToast(result.log || "Done!", "success");
    }
    if (GameEngine.state.gameOver) { this.showGameOver(); return; }
    this.showScreen("dashboard");
  },

  // ── Shelter Screen ────────────────────────────────────────
  renderShelter() {
    const s = GameEngine.state;
    const c = s.character;
    const container = document.getElementById("shelter-content");

    // Icon map for upgrades (replaces bootstrap class names)
    const upgradeIconMap = {
      'bi-tools': 'tools',
      'bi-fire': 'flame',
      'bi-cloud-rain-fill': 'cloudRain',
      'bi-shield-fill': 'shield',
      'bi-moon-fill': 'moon',
      'bi-funnel-fill': 'funnel',
      'bi-flower1': 'flower',
      'bi-binoculars-fill': 'binoculars',
    };

    let actionsHtml = `
      <div class="shelter-section">
        <h3>${icon('hammer')} Shelter Actions</h3>
        <div class="action-grid">
          <button class="action-btn" onclick="UI.shelterAction('clean')" ${s.ap < 4 ? 'disabled' : ''}>
            <span>${icon('tools')} Clean Debris</span> <span class="ap-cost">4 AP</span>
          </button>
          <button class="action-btn" onclick="UI.shelterAction('patch')" ${s.ap < 6 || s.shelter.windowsPatched >= 3 ? 'disabled' : ''}>
            <span>${icon('grid')} Patch Window</span> <span class="ap-cost">6 AP / 2 Wood</span>
          </button>
          <button class="action-btn" onclick="UI.shelterAction('rest')" ${s.ap < 8 ? 'disabled' : ''}>
            <span>${icon('moon')} Rest</span> <span class="ap-cost">8 AP</span>
          </button>`;
    if (s.shelter.upgrades.alcohol_stove) {
      actionsHtml += `
          <button class="action-btn" onclick="UI.shelterAction('boil')" ${s.ap < 2 ? 'disabled' : ''}>
            <span>${icon('dropletHalf')} Boil Water</span> <span class="ap-cost">2 AP</span>
          </button>`;
    }
    actionsHtml += `</div></div>`;

    let upgradesHtml = `<div class="shelter-section"><h3>${icon('buildingGear')} Upgrades</h3><div class="upgrade-grid">`;
    for (const [id, upgrade] of Object.entries(DATA.shelterUpgrades)) {
      const built = s.shelter.upgrades[id];
      const locked = upgrade.requires && !s.shelter.upgrades[upgrade.requires];
      const canBuild = !built && !locked && Character.canAfford(c, upgrade.cost) && s.ap >= upgrade.apCost;
      const costText = Object.entries(upgrade.cost).map(([res, amt]) => {
        const have = Character.getResourceCount(c, res);
        return `<span class="${have >= amt ? 'text-success' : 'text-danger'}">${have}/${amt} ${res}</span>`;
      }).join(" / ");
      const upgradeIconName = upgradeIconMap[upgrade.icon] || 'tools';
      upgradesHtml += `
        <div class="upgrade-card ${built ? 'built' : ''} ${locked ? 'locked' : ''}">
          <div class="upgrade-icon">${icon(upgradeIconName)}</div>
          <div class="upgrade-info">
            <h4>${upgrade.name} ${built ? icon('checkCircle') : ''}</h4>
            <p>${upgrade.description}</p>
            ${!built ? `<div class="upgrade-cost">${costText} / ${upgrade.apCost} AP</div>` : ''}
            ${locked ? `<div class="upgrade-locked">${icon('lock')} Requires: ${DATA.shelterUpgrades[upgrade.requires].name}</div>` : ''}
          </div>
          ${!built && !locked ? `<button class="build-btn" onclick="UI.buildUpgrade('${id}')" ${!canBuild ? 'disabled' : ''}>Build</button>` : ''}
        </div>`;
    }
    upgradesHtml += `</div></div>`;

    // Crafting section
    let craftingHtml = '';
    if (s.shelter.upgrades.improvised_bench) {
      craftingHtml = `<div class="shelter-section"><h3>${icon('tools')} Crafting Bench</h3><div class="craft-grid">`;
      for (const [id, recipe] of Object.entries(DATA.craftingRecipes)) {
        const ingredientHtml = Object.entries(recipe.ingredients).map(([itemId, qty]) => {
          const have = c.inventory.filter(i => i.id === itemId).length;
          const itemName = DATA.items[itemId]?.name || itemId;
          return `<span class="${have >= qty ? 'text-success' : 'text-danger'}">${itemName} x${qty} (${have})</span>`;
        }).join(' + ');
        const canCraft = Object.entries(recipe.ingredients).every(([itemId, qty]) =>
          c.inventory.filter(i => i.id === itemId).length >= qty
        ) && s.ap >= recipe.apCost;
        const resultItem = DATA.items[recipe.result];
        craftingHtml += `
          <div class="craft-card">
            <div class="craft-info">
              <strong>${recipe.name}</strong>
              <p>${recipe.description}</p>
              <div class="craft-ingredients">${ingredientHtml}</div>
              ${resultItem?.combatBonus ? `<span class="item-stat">+${resultItem.combatBonus} Combat</span>` : ''}
            </div>
            <div class="craft-action">
              <span class="ap-cost">${recipe.apCost} AP</span>
              <button class="build-btn" onclick="UI.craftItem('${id}')" ${!canCraft ? 'disabled' : ''}>Craft</button>
            </div>
          </div>`;
      }
      craftingHtml += `</div></div>`;
    } else {
      craftingHtml = `<div class="shelter-section"><h3>${icon('lock')} Crafting</h3><p class="empty-state">Build an Improvised Bench to unlock crafting.</p></div>`;
    }

    let statusHtml = `
      <div class="shelter-section shelter-status">
        <div class="shelter-stat">
          <span>${icon('grid')} Windows Patched</span>
          <div class="mini-bar-container"><div class="mini-bar" style="width:${(s.shelter.windowsPatched / s.shelter.maxWindows) * 100}%"></div></div>
          <span>${s.shelter.windowsPatched}/${s.shelter.maxWindows}</span>
        </div>
        <div class="shelter-stat">
          <span>${icon('warning')} Raid Risk</span>
          <div class="mini-bar-container raid"><div class="mini-bar" style="width:${s.shelter.raidRisk}%"></div></div>
          <span>${s.shelter.raidRisk}%</span>
        </div>
      </div>`;
    container.innerHTML = statusHtml + actionsHtml + craftingHtml + upgradesHtml;
  },

  shelterAction(action) {
    let result;
    switch (action) {
      case "clean": result = GameEngine.cleanDebris(); break;
      case "patch": result = GameEngine.patchWindow(); break;
      case "rest": result = GameEngine.rest(); break;
      case "boil": result = GameEngine.boilWater(); break;
    }
    if (result && !result.success) this.showToast(result.reason, "error");
    else if (result) this.showToast(result.log || "Done!", "success");
    this.renderShelter();
    this.updateTopBar();
  },

  craftItem(recipeId) {
    const result = GameEngine.craftItem(recipeId);
    if (!result.success) this.showToast(result.reason, "error");
    else this.showToast(`Crafted ${result.item}!`, "success");
    this.renderShelter();
    this.updateTopBar();
  },

  buildUpgrade(upgradeId) {
    const result = GameEngine.buildUpgrade(upgradeId);
    if (!result.success) this.showToast(result.reason, "error");
    else this.showToast(`${DATA.shelterUpgrades[upgradeId].name} built!`, "success");
    this.renderShelter();
    this.updateTopBar();
  },

  // ── Scavenge Screen ───────────────────────────────────────
  renderScavenge() {
    const s = GameEngine.state;
    const container = document.getElementById("scavenge-content");
    if (this.encounterState) { this.renderEncounter(); return; }
    if (this.tradeState) { this.renderTradeEncounter(); return; }

    // Region selector
    let regionHtml = `<div class="region-selector"><h3>${icon('signpost')} Travel to Region</h3><div class="region-bar">`;
    for (const [id, region] of Object.entries(DATA.regions)) {
      const isCurrent = s.currentRegion === id;
      const canTravel = s.ap >= region.travelAP || isCurrent;
      regionHtml += `<button class="region-btn ${isCurrent ? 'active' : ''} ${!canTravel ? 'disabled' : ''}"
        onclick="${!isCurrent && canTravel ? `UI.travelToRegion('${id}')` : ''}"
        ${!canTravel ? 'disabled' : ''}>
        <span>${region.name}</span>
        ${!isCurrent ? `<span class="ap-cost">${region.travelAP} AP</span>` : '<span class="ap-cost">Here</span>'}
      </button>`;
    }
    regionHtml += `</div></div>`;

    // Location cards for current region
    const currentRegion = DATA.regions[s.currentRegion || 'desolated_town'];
    const locationIds = currentRegion ? currentRegion.locations : Object.keys(DATA.locations);

    let html = regionHtml + `<div class="location-grid">`;
    for (const id of locationIds) {
      const loc = GameEngine.getLocation(id);
      if (!loc) continue;
      const canTravel = s.ap >= loc.travelAP;
      let dangerPips = '';
      for (let i = 0; i < 5; i++) {
        dangerPips += `<span class="danger-pip ${i < loc.dangerLevel ? 'filled' : 'empty'}"></span>`;
      }
      html += `
        <div class="location-card ${!canTravel ? 'disabled' : ''}" onclick="${canTravel ? `UI.scavenge('${id}')` : ''}">
          <div class="location-danger">${dangerPips}</div>
          <h3>${loc.name}</h3>
          <p class="location-desc">${loc.description}</p>
          <div class="location-meta">
            <span class="ap-cost">${icon('signpost')} ${loc.travelAP} AP</span>
            <span class="danger-label">Danger: ${loc.dangerLevel}/5</span>
          </div>
          <p class="location-flavor">${loc.flavor}</p>
        </div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
  },

  travelToRegion(regionId) {
    const result = GameEngine.travelToRegion(regionId);
    if (!result.success) { this.showToast(result.reason, "error"); return; }
    this.showToast(`Traveled to ${result.region}`, "success");
    this.renderScavenge();
    this.updateTopBar();
  },

  scavenge(locationId) {
    const result = GameEngine.travelToLocation(locationId);
    if (!result.success) { this.showToast(result.reason, "error"); return; }

    // Check if encounter is a trading encounter
    if (result.encounterId && DATA.tradeEncounters[result.encounterId]) {
      this.tradeState = { tradeEncId: result.encounterId, ...result };
      this.renderTradeEncounter();
      this.updateTopBar();
      return;
    }

    this.encounterState = result;
    this.renderEncounter();
    this.updateTopBar();
  },

  renderTradeEncounter() {
    const container = document.getElementById("scavenge-content");
    const tradeEnc = DATA.tradeEncounters[this.tradeState.tradeEncId];
    if (!tradeEnc) { this.tradeState = null; this.renderScavenge(); return; }

    const c = GameEngine.state.character;
    let html = `<div class="encounter-panel">
      <h2>${icon('people')} ${tradeEnc.title}</h2>
      <p class="encounter-text">${tradeEnc.text}</p>
      <div class="trade-options">`;

    tradeEnc.trades.forEach((trade, idx) => {
      const haveCount = c.inventory.filter(i => i.id === trade.give).length;
      const canTrade = haveCount >= trade.giveQty;
      html += `<button class="action-btn trade-btn ${!canTrade ? 'disabled' : ''}"
        onclick="${canTrade ? `UI.executeTrade('${this.tradeState.tradeEncId}', ${idx})` : ''}"
        ${!canTrade ? 'disabled' : ''}>
        <span>${trade.label}</span>
        <span class="trade-stock ${canTrade ? 'text-success' : 'text-danger'}">(Have: ${haveCount})</span>
      </button>`;
    });

    html += `</div>
      <button class="action-btn" onclick="UI.dismissTrade()">
        <span>${icon('arrowLeft')} Walk Away</span>
      </button>
    </div>`;
    container.innerHTML = html;
  },

  executeTrade(tradeEncId, tradeIndex) {
    const result = GameEngine.executeTrade(tradeEncId, tradeIndex);
    if (!result.success) { this.showToast(result.reason, "error"); return; }
    this.showToast(`Traded ${result.gave} for ${result.received}!`, "success");
    if (result.ambush) {
      this.showToast(`Ambushed! -${result.ambushDamage} Health!`, "error");
    }
    this.tradeState = null;
    this.renderScavenge();
    this.updateTopBar();
  },

  dismissTrade() {
    this.tradeState = null;
    this.renderScavenge();
  },

  renderEncounter() {
    const container = document.getElementById("scavenge-content");
    const enc = this.encounterState;
    if (!enc) return;
    const encounter = enc.encounter;
    let html = `
      <div class="encounter-panel">
        <div class="encounter-header">
          <h2>${encounter.title}</h2>
          <span class="encounter-location">${icon('locationPin')} ${enc.location.name}</span>
        </div>
        <div class="encounter-text"><p>${encounter.text}</p></div>
        <div class="encounter-choices">`;

    for (const choice of encounter.choices) {
      let meta = "";
      if (choice.stat) {
        const statVal = Character.getStatWithMutations(GameEngine.state.character, choice.stat);
        let chance = (100 - choice.baseDifficulty) + (statVal * 5);
        const weapon = Character.getEquippedWeapon(GameEngine.state.character);
        if (choice.stat === "strength" && weapon) chance += weapon.combatBonus || 0;
        chance = Math.max(5, Math.min(95, chance));
        meta = `<span class="choice-chance ${chance > 60 ? 'good' : chance > 35 ? 'mid' : 'bad'}">${chance}% (${choice.stat.toUpperCase()})</span>`;
      }
      if (choice.requiresWeapon && !Character.getEquippedWeapon(GameEngine.state.character)) {
        meta += `<span class="choice-req text-danger">${icon('warning')} Needs weapon</span>`;
      }
      if (choice.cost) {
        const has = Character.hasItem(GameEngine.state.character, choice.cost);
        meta += `<span class="choice-req ${has ? '' : 'text-danger'}">Costs: ${DATA.items[choice.cost]?.name || choice.cost}</span>`;
      }
      if (choice.apCost) meta += `<span class="ap-cost">+${choice.apCost} AP</span>`;
      const disabled = (choice.requiresWeapon && !Character.getEquippedWeapon(GameEngine.state.character)) ||
        (choice.cost && !Character.hasItem(GameEngine.state.character, choice.cost));
      html += `
        <button class="choice-btn ${choice.safe ? 'safe' : ''}" onclick="UI.resolveChoice('${choice.id}')" ${disabled ? 'disabled' : ''}>
          <span class="choice-label">${choice.label}</span>
          <div class="choice-meta">${meta}</div>
        </button>`;
    }
    html += `</div></div>`;
    container.innerHTML = html;
  },

  resolveChoice(choiceId) {
    const enc = this.encounterState;
    if (!enc) return;
    const result = GameEngine.resolveEncounterChoice(enc.locationId, enc.encounterId, choiceId);
    this.encounterState = null;
    if (GameEngine.state.gameOver) { this.showGameOver(); return; }
    if (!result.success) { this.showToast(result.reason, "error"); this.renderScavenge(); return; }

    const modal = document.getElementById("result-modal");
    const overlay = document.getElementById("modal-overlay");
    let html = `<div class="result-${result.outcome}">`;
    if (result.outcome === "success") {
      html += `<h2 class="result-title success">${icon('checkCircle')} Success!</h2>`;
      if (result.loot.length > 0) {
        html += `<div class="result-loot"><h3>Loot Found:</h3><ul>`;
        result.loot.forEach(l => html += `<li>+ ${l}</li>`);
        html += `</ul></div>`;
      }
      if (result.sanity > 0) html += `<p class="text-success">+${result.sanity} Sanity</p>`;
    } else if (result.outcome === "failure") {
      html += `<h2 class="result-title failure">${icon('xCircle')} Failed!</h2>`;
      if (result.damage > 0) html += `<p class="text-danger">-${result.damage} Health</p>`;
      if (result.infection > 0) html += `<p class="text-danger">+${result.infection}% Infection</p>`;
    } else {
      html += `<h2 class="result-title neutral">${icon('arrowLeftCircle')} Retreated Safely</h2>`;
      if (result.sanity < 0) html += `<p class="text-warning">${result.sanity} Sanity</p>`;
    }
    html += `<button class="action-btn modal-close-btn" onclick="UI.closeModal()">Continue</button></div>`;
    modal.innerHTML = html;
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    this.updateTopBar();
  },

  closeModal() {
    document.getElementById("result-modal").classList.add("hidden");
    document.getElementById("modal-overlay").classList.add("hidden");
    this.renderScavenge();
    this.updateTopBar();
  },

  // ── Character Screen ──────────────────────────────────────
  renderCharacter() {
    const c = GameEngine.state.character;
    const container = document.getElementById("character-content");
    const tier = Character.getMutationTier(c);
    container.innerHTML = `
      <div class="character-sheet">
        <div class="char-header">
          <h2>${c.name}</h2>
          <p>${c.age} years old · ${c.sex} · ${c.profession}</p>
          <p class="char-flavor">${c.professionFlavor}</p>
        </div>
        <div class="char-stats-grid">
          <div class="char-stat">
            <span class="stat-icon">${icon('lightning')}</span>
            <span class="stat-name">Strength</span>
            <span class="stat-value">${Character.getStatWithMutations(c, 'strength')}</span>
          </div>
          <div class="char-stat">
            <span class="stat-icon">${icon('wind')}</span>
            <span class="stat-name">Dexterity</span>
            <span class="stat-value">${Character.getStatWithMutations(c, 'dexterity')}</span>
          </div>
          <div class="char-stat">
            <span class="stat-icon">${icon('shieldCheck')}</span>
            <span class="stat-name">Endurance</span>
            <span class="stat-value">${c.stats.endurance}</span>
          </div>
          <div class="char-stat">
            <span class="stat-icon">${icon('lightbulb')}</span>
            <span class="stat-name">Intelligence</span>
            <span class="stat-value">${c.stats.intelligence}</span>
          </div>
          <div class="char-stat">
            <span class="stat-icon">${icon('eye')}</span>
            <span class="stat-name">Sanity</span>
            <span class="stat-value">${c.stats.sanity}</span>
          </div>
        </div>
        ${tier ? `
        <div class="mutation-section">
          <h3>${icon('virus')} Active Mutation: ${tier.name}</h3>
          <p>${tier.description}</p>
          <div class="infection-display">
            <div class="infection-bar-large"><div class="infection-fill" style="width:${c.infection}%"></div></div>
            <span>${c.infection}% Infected</span>
          </div>
        </div>` : `
        <div class="mutation-section clean">
          <h3>${icon('virus')} Infection: ${c.infection}%</h3>
          <p>${c.infection > 0 ? "The virus is in your blood. Find antibiotics." : "Clean. For now."}</p>
        </div>`}
        <div class="char-survival">
          <h3>${icon('chartBar')} Survival Record</h3>
          <div class="stat-row"><span>Days Survived</span><span>${GameEngine.state.day}</span></div>
          <div class="stat-row"><span>Scavenging Runs</span><span>${GameEngine.state.totalScavenges}</span></div>
          <div class="stat-row"><span>Hostiles Defeated</span><span>${GameEngine.state.totalKills}</span></div>
        </div>
      </div>`;
  },

  // ── Inventory Screen ──────────────────────────────────────
  renderInventory() {
    const c = GameEngine.state.character;
    const container = document.getElementById("inventory-content");
    const equippedWeapon = Character.getEquippedWeapon(c);

    // Equipped weapon banner
    let equippedHtml = `<div class="equipped-banner">
      <h3>${icon('crosshair')} Equipped Weapon</h3>
      ${equippedWeapon
        ? `<div class="equipped-weapon-display">
            <strong>${equippedWeapon.name}</strong>
            <span class="item-stat">+${equippedWeapon.combatBonus} Combat</span>
            <button class="unequip-btn" onclick="UI.unequipWeapon()">Unequip</button>
          </div>`
        : `<p class="equipped-empty">No weapon equipped — fighting barehanded</p>`}
    </div>`;

    const categories = {
      weapon: { label: `${icon('crosshair')} Weapons`, items: [] },
      food: { label: `${icon('flame')} Food`, items: [] },
      water: { label: `${icon('droplet')} Water`, items: [] },
      medical: { label: `${icon('bandaid')} Medical`, items: [] },
      material: { label: `${icon('box')} Materials`, items: [] },
      tool: { label: `${icon('tools')} Tools`, items: [] },
      other: { label: `${icon('paperclip')} Other`, items: [] }
    };
    c.inventory.forEach((item, idx) => {
      const cat = categories[item.type] || categories.other;
      cat.items.push({ ...item, idx });
    });
    let html = equippedHtml + `<div class="inventory-grid">`;
    for (const [type, cat] of Object.entries(categories)) {
      if (cat.items.length === 0) continue;
      html += `<div class="inv-category"><h3>${cat.label}</h3><div class="inv-items">`;
      cat.items.forEach(item => {
        const usable = ["food", "water", "medical"].includes(item.type);
        const isEquipped = item.type === 'weapon' && c.equipped === item.id;
        const isWeapon = item.type === 'weapon';
        html += `
          <div class="inv-item ${isEquipped ? 'inv-item-equipped' : ''}">
            <div class="inv-item-info">
              <strong>${item.name} ${isEquipped ? '<span class="equipped-badge">EQUIPPED</span>' : ''}</strong>
              <p>${item.description || ""}</p>
              ${item.combatBonus ? `<span class="item-stat">+${item.combatBonus} Combat</span>` : ""}
              ${item.healAmount ? `<span class="item-stat">+${item.healAmount} Health</span>` : ""}
              ${item.hungerRestore ? `<span class="item-stat">+${item.hungerRestore} Hunger</span>` : ""}
              ${item.thirstRestore ? `<span class="item-stat">+${item.thirstRestore} Thirst</span>` : ""}
              ${item.infectionCure ? `<span class="item-stat text-success">-${item.infectionCure}% Infection</span>` : ""}
              ${item.infectionRisk ? `<span class="item-stat text-warning">${icon('warning')} ${item.infectionRisk}% Infection Risk</span>` : ""}
              ${item.amount ? `<span class="item-stat">x${item.amount}</span>` : ""}
            </div>
            <div class="inv-item-actions">
              ${isWeapon && !isEquipped ? `<button class="equip-btn" onclick="UI.equipWeapon('${item.id}')">Equip</button>` : ''}
              ${isWeapon && isEquipped ? `<button class="unequip-btn" onclick="UI.unequipWeapon()">Unequip</button>` : ''}
              ${usable ? `<button class="use-btn" onclick="UI.useItem('${item.id}')">Use</button>` : ""}
            </div>
          </div>`;
      });
      html += `</div></div>`;
    }
    if (c.inventory.length === 0) html += `<p class="empty-state">Your pockets are empty. Time to scavenge.</p>`;
    html += `</div>`;
    container.innerHTML = html;
  },

  equipWeapon(itemId) {
    Character.equipWeapon(GameEngine.state.character, itemId);
    GameEngine.save();
    const weapon = GameEngine.state.character.inventory.find(i => i.id === itemId);
    this.showToast(`Equipped ${weapon ? weapon.name : 'weapon'}`, 'success');
    this.renderInventory();
    this.updateTopBar();
  },

  unequipWeapon() {
    Character.unequipWeapon(GameEngine.state.character);
    GameEngine.save();
    this.showToast('Weapon unequipped', 'info');
    this.renderInventory();
    this.updateTopBar();
  },

  useItem(itemId) {
    const result = GameEngine.useItem(itemId);
    if (!result.success) this.showToast(result.reason, "error");
    else this.showToast(result.effects.join(", "), "success");
    this.renderInventory();
    this.updateTopBar();
  },

  // ── Life Log ──────────────────────────────────────────────
  renderLog() {
    const s = GameEngine.state;
    const container = document.getElementById("log-content");
    let html = `<div class="life-log">`;
    const entries = [...s.log].reverse();
    let currentDay = -1;
    entries.forEach(entry => {
      if (entry.day !== currentDay) {
        if (currentDay !== -1) html += `</div>`;
        currentDay = entry.day;
        html += `<div class="log-day"><h3 class="log-day-header">Day ${currentDay}</h3>`;
      }
      html += `<p class="log-entry ${entry.text.includes("[!]") || entry.text.includes("[RAID]") ? 'warning' : ''} ${entry.text.includes("[DEATH]") ? 'death' : ''}">${entry.text}</p>`;
    });
    if (currentDay !== -1) html += `</div>`;
    html += `</div>`;
    container.innerHTML = html;
  },

  // ── Game Over ─────────────────────────────────────────────
  showGameOver() {
    const s = GameEngine.state;
    const c = s.character;
    document.getElementById("game-container").classList.add("hidden");
    const go = document.getElementById("game-over-screen");
    go.classList.remove("hidden");
    const reasons = {
      injuries: { title: "DEATH BY INJURIES", iconName: "xCircle", desc: "The wounds were too much. You collapsed and didn't get back up." },
      madness: { title: "LOST TO MADNESS", iconName: "eyeOff", desc: "Your mind shattered. You wander the streets now, screaming at shadows." },
      turned: { title: "YOU HAVE TURNED", iconName: "skull", desc: "The infection won. You are one of them now. Hungry. Empty. Different." },
      unknown: { title: "PERISHED", iconName: "xOctagon", desc: "The wasteland claimed another." },
    };
    const reason = reasons[s.gameOverReason] || reasons.unknown;
    go.innerHTML = `
      <div class="game-over-content">
        <div class="go-icon">${icon(reason.iconName)}</div>
        <h1 class="go-title">${reason.title}</h1>
        <p class="go-desc">${reason.desc}</p>
        <div class="obituary">
          <h2>${c.name}</h2>
          <p>${c.age} years old · ${c.sex} · ${c.profession}</p>
          <hr>
          <div class="obit-stats">
            <div><span>Days Survived</span><strong>${s.day}</strong></div>
            <div><span>Scavenging Runs</span><strong>${s.totalScavenges}</strong></div>
            <div><span>Hostiles Defeated</span><strong>${s.totalKills}</strong></div>
          </div>
        </div>
        <button class="action-btn new-life-btn" onclick="location.reload()">
          ${icon('refresh')} New Life
        </button>
      </div>`;
  },

  // ── Toast ─────────────────────────────────────────────────
  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // ── Custom Confirm Modal ──────────────────────────────────
  showConfirmModal(title, message, onConfirm) {
    const overlay = document.getElementById("confirm-modal-overlay");
    const modal = document.getElementById("confirm-modal");
    document.getElementById("confirm-modal-title").textContent = title;
    document.getElementById("confirm-modal-message").innerHTML = message;
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
    requestAnimationFrame(() => {
      overlay.classList.add("visible");
      modal.classList.add("visible");
    });

    const cancelBtn = document.getElementById("confirm-modal-cancel");
    const okBtn = document.getElementById("confirm-modal-ok");

    const cleanup = () => {
      cancelBtn.replaceWith(cancelBtn.cloneNode(true));
      okBtn.replaceWith(okBtn.cloneNode(true));
    };

    cancelBtn.addEventListener("click", () => {
      this.hideConfirmModal();
      cleanup();
    }, { once: true });

    okBtn.addEventListener("click", () => {
      this.hideConfirmModal();
      cleanup();
      if (onConfirm) onConfirm();
    }, { once: true });

    overlay.addEventListener("click", () => {
      this.hideConfirmModal();
      cleanup();
    }, { once: true });
  },

  hideConfirmModal() {
    const overlay = document.getElementById("confirm-modal-overlay");
    const modal = document.getElementById("confirm-modal");
    overlay.classList.remove("visible");
    modal.classList.remove("visible");
    setTimeout(() => {
      overlay.classList.add("hidden");
      modal.classList.add("hidden");
    }, 300);
  }
};

document.addEventListener("DOMContentLoaded", () => { UI.init(); });
