// ============================================================
// PROJECT RESURGENCE: THE SILENT ZONE — Core Game Engine
// ============================================================

const GameEngine = {
    state: null,

    newGame() {
        const character = Character.generate();
        this.state = {
            character,
            day: 1,
            timeOfDay: "day",    // "day" | "night"
            ap: 24,
            maxAP: 24,
            shelter: {
                windowsPatched: 0,
                maxWindows: 3,
                debrisCleaned: 0,
                upgrades: {},      // upgradeId: true
                raidRisk: 60,      // base %
            },
            resources: {},       // tracked via character.inventory
            log: [],             // life log entries
            daysFed: 0,
            daysHydrated: 0,
            mutationCountdown: -1,
            gameOver: false,
            gameOverReason: null,
            totalKills: 0,
            totalScavenges: 0,
            totalDaysAlive: 0,
            currentRegion: "desolated_town",
            started: Date.now(),
        };

        // Opening narrative
        this.addLog(`Day 1: The sirens stopped. The neighbors are... different now. You find an abandoned townhouse on the edge of desolated town. It's cold, but it's yours. For now.`);
        this.addLog(`You are ${character.name}, age ${character.age}. ${character.professionFlavor}`);

        Storage.saveGame(this.state);
        return this.state;
    },

    loadGame() {
        const saved = Storage.loadGame();
        if (saved) {
            this.state = saved;
            return true;
        }
        return false;
    },

    addLog(entry) {
        this.state.log.push({
            text: entry,
            day: this.state.day,
            time: this.state.timeOfDay,
            timestamp: Date.now()
        });
    },

    getLocation(locId) {
        return DATA.locations[locId] || DATA.locationsExtra[locId] || null;
    },

    // ── Crafting ─────────────────────────────────────────────
    craftItem(recipeId) {
        if (!this.state.shelter.upgrades.improvised_bench) {
            return { success: false, reason: "You need an Improvised Bench to craft." };
        }
        const recipe = DATA.craftingRecipes[recipeId];
        if (!recipe) return { success: false, reason: "Unknown recipe." };
        if (this.state.ap < recipe.apCost) return { success: false, reason: "Not enough AP." };

        // Check ingredients
        for (const [itemId, qty] of Object.entries(recipe.ingredients)) {
            let count = 0;
            for (const inv of this.state.character.inventory) {
                if (inv.id === itemId) count++;
            }
            if (count < qty) {
                const itemName = DATA.items[itemId]?.name || itemId;
                return { success: false, reason: `Need ${qty} ${itemName} (have ${count}).` };
            }
        }

        // Consume ingredients
        for (const [itemId, qty] of Object.entries(recipe.ingredients)) {
            let toRemove = qty;
            for (let i = this.state.character.inventory.length - 1; i >= 0 && toRemove > 0; i--) {
                if (this.state.character.inventory[i].id === itemId) {
                    this.state.character.inventory.splice(i, 1);
                    toRemove--;
                }
            }
        }

        // Add crafted item
        this.state.ap -= recipe.apCost;
        Character.addItem(this.state.character, recipe.result);
        this.addLog(`Day ${this.state.day}: Crafted ${recipe.name}.`);
        this.save();
        return { success: true, item: recipe.name };
    },

    // ── Trading ──────────────────────────────────────────────
    executeTrade(tradeEncId, tradeIndex) {
        const tradeEnc = DATA.tradeEncounters[tradeEncId];
        if (!tradeEnc) return { success: false, reason: "Unknown trade." };
        const trade = tradeEnc.trades[tradeIndex];
        if (!trade) return { success: false, reason: "Invalid trade option." };

        // Check player has enough items
        let count = 0;
        for (const inv of this.state.character.inventory) {
            if (inv.id === trade.give) count++;
        }
        if (count < trade.giveQty) {
            return { success: false, reason: `Not enough ${DATA.items[trade.give]?.name || trade.give}.` };
        }

        // Remove given items
        let toRemove = trade.giveQty;
        for (let i = this.state.character.inventory.length - 1; i >= 0 && toRemove > 0; i--) {
            if (this.state.character.inventory[i].id === trade.give) {
                this.state.character.inventory.splice(i, 1);
                toRemove--;
            }
        }

        // Add received items
        for (let i = 0; i < trade.receiveQty; i++) {
            Character.addItem(this.state.character, trade.receive);
        }

        const result = {
            success: true,
            gave: `${trade.giveQty}x ${DATA.items[trade.give]?.name || trade.give}`,
            received: `${trade.receiveQty}x ${DATA.items[trade.receive]?.name || trade.receive}`,
            afterText: tradeEnc.afterText,
            ambush: false,
            ambushDamage: 0,
        };

        this.addLog(`Day ${this.state.day}: Traded ${result.gave} for ${result.received}.`);

        // Post-trade danger
        if (tradeEnc.dangerAfter && Math.random() * 100 < (tradeEnc.ambushChance || 0)) {
            const dmg = tradeEnc.ambushDamage || 10;
            Character.applyDamage(this.state.character, dmg);
            result.ambush = true;
            result.ambushDamage = dmg;
            this.addLog(`Day ${this.state.day}: [!] Ambushed after the trade! (-${dmg} Health)`);
        }

        this.save();
        return result;
    },

    // ── Region Travel ────────────────────────────────────────
    travelToRegion(regionId) {
        const region = DATA.regions[regionId];
        if (!region) return { success: false, reason: "Unknown region." };
        if (this.state.currentRegion === regionId) return { success: false, reason: "Already here." };
        if (this.state.ap < region.travelAP) return { success: false, reason: `Need ${region.travelAP} AP to travel.` };

        this.state.ap -= region.travelAP;
        this.state.currentRegion = regionId;
        this.addLog(`Day ${this.state.day}: Traveled to ${region.name}. (Cost ${region.travelAP} AP)`);
        this.save();
        return { success: true, region: region.name };
    },


    canSpendAP(cost) {
        return this.state.ap >= cost;
    },

    spendAP(cost) {
        if (this.state.ap < cost) return false;
        this.state.ap -= cost;
        if (this.state.ap <= 0) {
            this.state.ap = 0;
        }
        this.save();
        return true;
    },

    // ── Shelter Actions ───────────────────────────────────────
    cleanDebris() {
        if (!this.canSpendAP(4)) return { success: false, reason: "Not enough AP" };
        this.spendAP(4);
        this.state.shelter.debrisCleaned++;

        const found = [];
        const action = DATA.shelterActions.clean_debris;
        for (const drop of action.loot) {
            if (Math.random() * 100 < drop.chance) {
                Character.addItem(this.state.character, drop.item);
                const item = DATA.items[drop.item];
                found.push(item ? item.name : drop.item);
            }
        }

        let logText = `Day ${this.state.day}: Spent hours clearing debris from the shelter.`;
        if (found.length > 0) {
            logText += ` Found: ${found.join(", ")}.`;
        } else {
            logText += ` Nothing useful in the rubble.`;
        }
        this.addLog(logText);
        this.save();
        return { success: true, found, log: logText };
    },

    patchWindow() {
        if (!this.canSpendAP(6)) return { success: false, reason: "Not enough AP" };
        if (this.state.shelter.windowsPatched >= this.state.shelter.maxWindows) {
            return { success: false, reason: "All windows are patched" };
        }
        const cost = { wood: 2 };
        if (!Character.canAfford(this.state.character, cost)) {
            return { success: false, reason: "Need 2 Wood" };
        }

        this.spendAP(6);
        Character.consumeResources(this.state.character, cost);
        this.state.shelter.windowsPatched++;
        this.state.shelter.raidRisk = Math.max(0, this.state.shelter.raidRisk - 10);

        const logText = `Day ${this.state.day}: Boarded up a window. The shelter feels a little safer now.`;
        this.addLog(logText);
        this.save();
        return { success: true, log: logText };
    },

    rest() {
        const apCost = 8;
        if (!this.canSpendAP(apCost)) return { success: false, reason: "Not enough AP" };
        this.spendAP(apCost);

        let healthGain = 10;
        let sanityGain = 8;

        // Bed roll bonus
        if (this.state.shelter.upgrades.bed_roll) {
            healthGain = Math.floor(healthGain * 1.5);
            sanityGain = Math.floor(sanityGain * 1.5);
        }

        this.state.character.health = Math.min(this.state.character.maxHealth, this.state.character.health + healthGain);
        Character.applySanityChange(this.state.character, sanityGain);

        const logText = `Day ${this.state.day}: Rested for a while. (+${healthGain} Health, +${sanityGain} Sanity)`;
        this.addLog(logText);
        this.save();
        return { success: true, healthGain, sanityGain, log: logText };
    },

    // ── Crafting / Upgrades ───────────────────────────────────
    buildUpgrade(upgradeId) {
        const upgrade = DATA.shelterUpgrades[upgradeId];
        if (!upgrade) return { success: false, reason: "Unknown upgrade" };
        if (this.state.shelter.upgrades[upgradeId]) return { success: false, reason: "Already built" };
        if (upgrade.requires && !this.state.shelter.upgrades[upgrade.requires]) {
            return { success: false, reason: `Requires ${DATA.shelterUpgrades[upgrade.requires].name}` };
        }
        if (!this.canSpendAP(upgrade.apCost)) return { success: false, reason: "Not enough AP" };
        if (!Character.canAfford(this.state.character, upgrade.cost)) {
            const missing = [];
            for (const [res, amt] of Object.entries(upgrade.cost)) {
                const have = Character.getResourceCount(this.state.character, res);
                if (have < amt) missing.push(`${amt - have} more ${res}`);
            }
            return { success: false, reason: `Need: ${missing.join(", ")}` };
        }

        this.spendAP(upgrade.apCost);
        Character.consumeResources(this.state.character, upgrade.cost);
        this.state.shelter.upgrades[upgradeId] = true;

        // Apply special effects
        if (upgrade.raidReduction) {
            this.state.shelter.raidRisk = Math.max(0, this.state.shelter.raidRisk - upgrade.raidReduction);
        }

        const logText = `Day ${this.state.day}: Built ${upgrade.name}. ${upgrade.description}`;
        this.addLog(logText);
        this.save();
        return { success: true, log: logText };
    },

    // ── Day Cycle ─────────────────────────────────────────────
    endDay() {
        // Consume food & water
        let hungerLoss = 15;
        let thirstLoss = 20;
        this.state.character.hunger = Math.max(0, this.state.character.hunger - hungerLoss);
        this.state.character.thirst = Math.max(0, this.state.character.thirst - thirstLoss);

        // Starvation
        if (this.state.character.hunger <= 0) {
            Character.applyDamage(this.state.character, 10);
            Character.applySanityChange(this.state.character, -5);
            this.addLog(`Night ${this.state.day}: Your stomach cramps with hunger. You're wasting away. (-10 Health, -5 Sanity)`);
        }

        // Dehydration
        if (this.state.character.thirst <= 0) {
            Character.applyDamage(this.state.character, 15);
            Character.applySanityChange(this.state.character, -3);
            this.addLog(`Night ${this.state.day}: Dehydration sets in. Your lips crack, your head pounds. (-15 Health, -3 Sanity)`);
        }

        // Window exposure
        const unpatchedWindows = this.state.shelter.maxWindows - this.state.shelter.windowsPatched;
        if (unpatchedWindows > 0) {
            const sicknessRoll = Math.random() * 100;
            if (sicknessRoll < unpatchedWindows * 15) {
                Character.applyDamage(this.state.character, 5);
                this.addLog(`Night ${this.state.day}: Cold air seeps through broken windows. You wake up shivering. (-5 Health)`);
            }
        }

        // Mutation sanity drain
        const mutTier = Character.getMutationTier(this.state.character);
        if (mutTier && mutTier.sanityDrain > 0) {
            Character.applySanityChange(this.state.character, -mutTier.sanityDrain);
            this.addLog(`Night ${this.state.day}: The infection gnaws at your mind. ${mutTier.name} (${mutTier.description}) (-${mutTier.sanityDrain} Sanity)`);
        }

        // Mutation countdown
        if (this.state.character.infection >= 90 && this.state.character.infection < 100) {
            if (this.state.mutationCountdown < 0) {
                this.state.mutationCountdown = 3;
                this.addLog(`Night ${this.state.day}: [!] THE CHANGE IS BEGINNING. You have ${this.state.mutationCountdown} days.`);
            } else {
                this.state.mutationCountdown--;
                if (this.state.mutationCountdown <= 0) {
                    this.state.character.infection = 100;
                    Character.applyInfection(this.state.character, 0); // trigger check
                    this.addLog(`Night ${this.state.day}: [!] THE CHANGE IS COMPLETE. You are no longer human.`);
                } else {
                    this.addLog(`Night ${this.state.day}: [!] ${this.state.mutationCountdown} days until The Change is complete.`);
                }
            }
        }

        // Daily resources from upgrades
        if (this.state.shelter.upgrades.rain_collector) {
            Character.addItem(this.state.character, "dirty_water");
            this.addLog(`Night ${this.state.day}: The rain collector gathered some dirty water.`);
        }
        if (this.state.shelter.upgrades.herb_garden && Math.random() > 0.5) {
            Character.addItem(this.state.character, "herbs");
            this.addLog(`Night ${this.state.day}: The herb garden produced some medicinal herbs.`);
        }

        // Night event
        const nightEvent = DATA.nightEvents[Math.floor(Math.random() * DATA.nightEvents.length)];
        this.addLog(`Night ${this.state.day}: ${nightEvent.text}`);
        if (nightEvent.sanityEffect) {
            Character.applySanityChange(this.state.character, nightEvent.sanityEffect);
        }

        // Raid check
        const raidChance = this.state.shelter.raidRisk;
        if (Math.random() * 100 < raidChance) {
            const raidEvent = DATA.raidEvents[Math.floor(Math.random() * DATA.raidEvents.length)];
            this.addLog(`Night ${this.state.day}: [RAID] ${raidEvent.text}`);
            if (raidEvent.stolenItems > 0) {
                for (let i = 0; i < raidEvent.stolenItems && this.state.character.inventory.length > 0; i++) {
                    const randIdx = Math.floor(Math.random() * this.state.character.inventory.length);
                    const stolen = this.state.character.inventory.splice(randIdx, 1)[0];
                    this.addLog(`  Lost: ${stolen.name}`);
                }
            }
            if (raidEvent.damage) Character.applyDamage(this.state.character, raidEvent.damage);
            if (raidEvent.infection) Character.applyInfection(this.state.character, raidEvent.infection);
        }

        // Check death
        if (!this.state.character.alive) {
            this.triggerGameOver();
            this.save();
            return;
        }

        // Advance day
        this.state.day++;
        this.state.totalDaysAlive = this.state.day;
        this.state.ap = this.state.maxAP;
        this.state.timeOfDay = "day";

        // Daily flavor
        if (Math.random() > 0.5) {
            const flavor = DATA.dailyFlavor[Math.floor(Math.random() * DATA.dailyFlavor.length)];
            this.addLog(`Day ${this.state.day}: ${flavor}`);
        }

        this.save();
    },

    // ── Scavenging ────────────────────────────────────────────
    travelToLocation(locationId) {
        const location = this.getLocation(locationId);
        if (!location) return { success: false, reason: "Unknown location" };
        if (!this.canSpendAP(location.travelAP)) return { success: false, reason: "Not enough AP to travel" };

        this.spendAP(location.travelAP);
        this.state.totalScavenges++;

        // Select encounter
        const encounterId = location.encounters[Math.floor(Math.random() * location.encounters.length)];
        const encounter = DATA.encounters[encounterId];

        this.addLog(`Day ${this.state.day}: Ventured to the ${location.name}. ${location.flavor}`);
        this.save();

        return {
            success: true,
            encounter,
            encounterId,
            location,
            locationId,
        };
    },

    resolveEncounterChoice(locationId, encounterId, choiceId) {
        const location = this.getLocation(locationId);
        const encounter = DATA.encounters[encounterId];
        const choice = encounter.choices.find(c => c.id === choiceId);
        if (!choice) return { success: false, reason: "Invalid choice" };

        const result = { success: true, outcome: "", loot: [], damage: 0, infection: 0, sanity: 0 };

        // Extra AP cost
        if (choice.apCost && !this.canSpendAP(choice.apCost)) {
            return { success: false, reason: "Not enough AP" };
        }
        if (choice.apCost) this.spendAP(choice.apCost);

        // Item cost
        if (choice.cost && !Character.hasItem(this.state.character, choice.cost)) {
            return { success: false, reason: `Requires ${DATA.items[choice.cost]?.name || choice.cost}` };
        }
        if (choice.cost) Character.removeItem(this.state.character, choice.cost);

        // Weapon requirement
        if (choice.requiresWeapon && !Character.getEquippedWeapon(this.state.character)) {
            return { success: false, reason: "You need a weapon!" };
        }

        // Safe retreat
        if (choice.safe) {
            result.outcome = "retreat";
            this.addLog(`Day ${this.state.day}: Chose caution. Retreated safely.`);
            if (choice.sanityLoss) {
                Character.applySanityChange(this.state.character, -choice.sanityLoss);
                result.sanity = -choice.sanityLoss;
                this.addLog(`  The guilt weighs on you. (-${choice.sanityLoss} Sanity)`);
            }
            if (choice.sanityGain) {
                Character.applySanityChange(this.state.character, choice.sanityGain);
                result.sanity = choice.sanityGain;
            }
            this.save();
            return result;
        }

        // Skill check
        let successChance = 50;
        if (choice.stat) {
            const statValue = Character.getStatWithMutations(this.state.character, choice.stat);
            successChance = (100 - choice.baseDifficulty) + (statValue * 5);

            // Equipment bonuses
            const weapon = Character.getEquippedWeapon(this.state.character);
            if (choice.stat === "strength" && weapon) {
                // Handle guns and ammo
                if (weapon.isGun && weapon.ammoType) {
                    const hasAmmo = Character.getAmmoCount(this.state.character, weapon.ammoType) >= (weapon.ammoPerShot || 1);
                    if (hasAmmo) {
                        Character.consumeAmmo(this.state.character, weapon.ammoType, weapon.ammoPerShot || 1);
                        successChance += weapon.combatBonus || 0;
                    } else {
                        successChance += weapon.noAmmoBonus || 3;
                    }
                } else {
                    successChance += weapon.combatBonus || 0;
                }
            }
            if (choice.stat === "dexterity") {
                const flashlight = this.state.character.inventory.find(i => i.id === "flashlight");
                if (flashlight) successChance += flashlight.scavengeBonus || 0;
                const lockpick = this.state.character.inventory.find(i => i.id === "lockpick");
                if (lockpick) successChance += lockpick.scavengeBonus || 0;
            }

            // Mutation bonuses
            const tier = Character.getMutationTier(this.state.character);
            if (tier && tier.effect) {
                if (tier.effect.scavengeBonus) successChance += tier.effect.scavengeBonus;
                if (tier.effect.combatBonus && choice.stat === "strength") successChance += tier.effect.combatBonus;
            }

            successChance = Math.max(5, Math.min(95, successChance));
        }

        const roll = Math.random() * 100;
        const succeeded = roll < successChance;

        if (succeeded) {
            result.outcome = "success";

            // Peaceful resolve — no loot, but no fight
            if (choice.peacefulResolve) {
                this.addLog(`Day ${this.state.day}: Talked your way out. Both sides walked away.`);
                Character.applySanityChange(this.state.character, 3);
                result.sanity = 3;
                this.save();
                return result;
            }

            if (choice.successLoot) {
                // Roll loot from location table
                const lootCount = choice.bonusLoot ? 3 : 2;
                for (let i = 0; i < lootCount; i++) {
                    for (const drop of location.lootTable) {
                        if (Math.random() * 100 < drop.chance) {
                            Character.addItem(this.state.character, drop.item);
                            const item = DATA.items[drop.item];
                            result.loot.push(item ? item.name : drop.item);
                            break;
                        }
                    }
                }
            }

            if (choice.rewardItem) {
                Character.addItem(this.state.character, choice.rewardItem);
                const item = DATA.items[choice.rewardItem];
                result.loot.push(item ? item.name : choice.rewardItem);
            }

            if (choice.sanityGain) {
                Character.applySanityChange(this.state.character, choice.sanityGain);
                result.sanity = choice.sanityGain;
            }

            let logText = `Day ${this.state.day}: Success! (${successChance.toFixed(0)}% chance)`;
            if (result.loot.length > 0) logText += ` Found: ${result.loot.join(", ")}.`;
            if (result.sanity > 0) logText += ` (+${result.sanity} Sanity)`;
            this.addLog(logText);

            // Noise alert — risk of attracting shamblers
            if (choice.noiseAlert && Math.random() < 0.35) {
                const noiseDmg = 10;
                Character.applyDamage(this.state.character, noiseDmg);
                result.damage += noiseDmg;
                this.addLog(`Day ${this.state.day}: The noise attracted a shambler! It got a hit in before you drove it off. (-${noiseDmg} Health)`);
            }

            if (choice.stat === "strength" && encounter.enemyDanger > 0) {
                this.state.totalKills++;
            }

        } else {
            result.outcome = "failure";

            if (choice.failDamage) {
                Character.applyDamage(this.state.character, choice.failDamage);
                result.damage = choice.failDamage;
            }
            if (choice.failInfection) {
                Character.applyInfection(this.state.character, choice.failInfection);
                result.infection = choice.failInfection;
            }

            let logText = `Day ${this.state.day}: Failed! (${successChance.toFixed(0)}% chance)`;
            if (result.damage > 0) logText += ` Took ${result.damage} damage.`;
            if (result.infection > 0) logText += ` Infection +${result.infection}%.`;
            this.addLog(logText);
        }

        // Check death
        if (!this.state.character.alive) {
            this.triggerGameOver();
        }

        this.save();
        return result;
    },

    // ── Consumables ───────────────────────────────────────────
    useItem(itemId) {
        const item = this.state.character.inventory.find(i => i.id === itemId);
        if (!item) return { success: false, reason: "Item not found" };

        const result = { success: true, effects: [] };

        if (item.type === "food") {
            if (item.requiresCooking && !this.state.shelter.upgrades.alcohol_stove) {
                return { success: false, reason: "Needs to be cooked! Build an Alcohol Stove first." };
            }
            this.state.character.hunger = Math.min(this.state.character.maxHunger, this.state.character.hunger + item.hungerRestore);
            result.effects.push(`+${item.hungerRestore} Hunger`);

            if (item.infectionRisk && !this.state.shelter.upgrades.alcohol_stove) {
                const infRoll = Math.random() * 100;
                if (infRoll < item.infectionRisk * 2) {
                    Character.applyInfection(this.state.character, item.infectionRisk);
                    result.effects.push(`+${item.infectionRisk}% Infection (food poisoning!)`);
                }
            }

            Character.removeItem(this.state.character, itemId);
            this.addLog(`Day ${this.state.day}: Consumed ${item.name}. ${result.effects.join(", ")}`);
        }
        else if (item.type === "water") {
            if (item.infectionRisk && !this.state.shelter.upgrades.water_filter) {
                const infRoll = Math.random() * 100;
                if (infRoll < item.infectionRisk * 3) {
                    Character.applyInfection(this.state.character, item.infectionRisk);
                    result.effects.push(`+${item.infectionRisk}% Infection (contaminated water!)`);
                }
            }
            this.state.character.thirst = Math.min(this.state.character.maxThirst, this.state.character.thirst + item.thirstRestore);
            result.effects.push(`+${item.thirstRestore} Thirst`);
            Character.removeItem(this.state.character, itemId);
            this.addLog(`Day ${this.state.day}: Drank ${item.name}. ${result.effects.join(", ")}`);
        }
        else if (item.type === "medical") {
            if (item.healAmount) {
                this.state.character.health = Math.min(this.state.character.maxHealth, this.state.character.health + item.healAmount);
                result.effects.push(`+${item.healAmount} Health`);
            }
            if (item.sanityRestore) {
                Character.applySanityChange(this.state.character, item.sanityRestore);
                result.effects.push(`+${item.sanityRestore} Sanity`);
            }
            if (item.infectionCure) {
                this.state.character.infection = Math.max(0, this.state.character.infection - item.infectionCure);
                if (this.state.character.infection < 90) this.state.mutationCountdown = -1;
                result.effects.push(`-${item.infectionCure}% Infection`);
            }
            Character.removeItem(this.state.character, itemId);
            this.addLog(`Day ${this.state.day}: Used ${item.name}. ${result.effects.join(", ")}`);
        }
        else {
            return { success: false, reason: "Can't use that item" };
        }

        if (!this.state.character.alive) this.triggerGameOver();
        this.save();
        return result;
    },

    boilWater() {
        if (!this.state.shelter.upgrades.alcohol_stove) {
            return { success: false, reason: "You need an Alcohol Stove to boil water" };
        }
        if (!this.canSpendAP(2)) return { success: false, reason: "Not enough AP" };
        if (!Character.hasItem(this.state.character, "dirty_water")) {
            return { success: false, reason: "No dirty water to boil" };
        }

        this.spendAP(2);
        Character.removeItem(this.state.character, "dirty_water");
        Character.addItem(this.state.character, "water_bottle");
        this.addLog(`Day ${this.state.day}: Boiled dirty water into clean drinking water.`);
        this.save();
        return { success: true };
    },

    // ── Game Over ─────────────────────────────────────────────
    triggerGameOver() {
        this.state.gameOver = true;
        this.state.gameOverReason = this.state.character.causeOfDeath || "unknown";
        const reasons = {
            injuries: "succumbed to injuries",
            madness: "lost their grip on reality",
            turned: "turned into one of them",
            unknown: "perished in the wasteland"
        };
        const reasonText = reasons[this.state.gameOverReason] || reasons.unknown;
        this.addLog(`\n[DEATH] ${this.state.character.name} ${reasonText} on Day ${this.state.day}.`);
        this.addLog(`Survived ${this.state.day} days. Scavenged ${this.state.totalScavenges} times. ${this.state.totalKills} hostiles defeated.`);
        Storage.deleteSave();
    },

    save() {
        if (this.state) Storage.saveGame(this.state);
    }
};
