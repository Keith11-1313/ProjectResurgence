// ============================================================
// PROJECT RESURGENCE: THE SILENT ZONE — Character System
// ============================================================

const Character = {
    generate() {
        const sex = Math.random() > 0.5 ? "Male" : "Female";
        const namePool = sex === "Male" ? DATA.firstNamesMale : DATA.firstNamesFemale;
        const firstName = namePool[Math.floor(Math.random() * namePool.length)];
        const lastName = DATA.lastNames[Math.floor(Math.random() * DATA.lastNames.length)];
        const age = Math.floor(Math.random() * 38) + 18; // 18-55

        const profKeys = Object.keys(DATA.professions);
        const profKey = profKeys[Math.floor(Math.random() * profKeys.length)];
        const profession = DATA.professions[profKey];

        // Base stats: 3-7 range
        const baseStats = {
            strength: Math.floor(Math.random() * 5) + 3,
            dexterity: Math.floor(Math.random() * 5) + 3,
            endurance: Math.floor(Math.random() * 5) + 3,
            intelligence: Math.floor(Math.random() * 5) + 3,
            sanity: Math.floor(Math.random() * 3) + 6, // 6-8 base
        };

        // Age modifiers
        if (age > 40) {
            baseStats.strength = Math.max(1, baseStats.strength - 1);
            baseStats.endurance = Math.max(1, baseStats.endurance - 1);
            baseStats.intelligence += 1;
        }
        if (age < 25) {
            baseStats.dexterity += 1;
            baseStats.endurance += 1;
        }

        // Apply profession mods
        for (const [stat, mod] of Object.entries(profession.statMods)) {
            if (baseStats[stat] !== undefined) {
                baseStats[stat] = Math.min(10, baseStats[stat] + mod);
            }
        }

        // Build inventory from starting items
        const inventory = profession.startingItems.map(itemId => {
            const item = DATA.items[itemId];
            if (item) return { id: itemId, ...item };
            return { id: itemId, name: itemId, type: "unknown" };
        });

        return {
            name: `${firstName} ${lastName}`,
            firstName,
            lastName,
            age,
            sex,
            professionKey: profKey,
            profession: profession.name,
            professionFlavor: profession.flavor,
            stats: baseStats,
            health: 80 + (baseStats.endurance * 2),      // 80-100
            maxHealth: 80 + (baseStats.endurance * 2),
            hunger: 70 + Math.floor(Math.random() * 20),  // 70-89 starting
            maxHunger: 100,
            thirst: 70 + Math.floor(Math.random() * 20),  // 70-89 starting
            maxThirst: 100,
            sanity: 60 + (baseStats.sanity * 4),           // starts relatively high
            maxSanity: 100,
            infection: profession.startingDebuffs?.infection || 0,
            stress: profession.startingDebuffs?.stress || 0,
            inventory,
            equipped: null, // weapon ID
            alive: true,
            causeOfDeath: null,
        };

        // Auto-equip first weapon
        const firstWeapon = result.inventory.find(i => i.type === 'weapon');
        if (firstWeapon) result.equipped = firstWeapon.id;

        return result;
    },

    // Get the equipped weapon (explicit equip system)
    getEquippedWeapon(character) {
        if (!character.equipped) return null;
        return character.inventory.find(i => i.id === character.equipped && i.type === 'weapon') || null;
    },

    equipWeapon(character, itemId) {
        const weapon = character.inventory.find(i => i.id === itemId && i.type === 'weapon');
        if (!weapon) return false;
        character.equipped = itemId;
        return true;
    },

    unequipWeapon(character) {
        character.equipped = null;
        return true;
    },

    // Ammo helpers
    getAmmoCount(character, ammoType) {
        return character.inventory.filter(i => i.type === 'ammo' && i.ammoType === ammoType)
            .reduce((sum, i) => sum + (i.amount || 0), 0);
    },

    consumeAmmo(character, ammoType, amount) {
        let remaining = amount;
        for (let i = character.inventory.length - 1; i >= 0 && remaining > 0; i--) {
            const item = character.inventory[i];
            if (item.type === 'ammo' && item.ammoType === ammoType) {
                if (item.amount <= remaining) {
                    remaining -= item.amount;
                    character.inventory.splice(i, 1);
                } else {
                    item.amount -= remaining;
                    remaining = 0;
                }
            }
        }
        return remaining === 0;
    },

    hasItem(character, itemId) {
        return character.inventory.some(i => i.id === itemId);
    },

    removeItem(character, itemId) {
        const idx = character.inventory.findIndex(i => i.id === itemId);
        if (idx !== -1) {
            character.inventory.splice(idx, 1);
            return true;
        }
        return false;
    },

    addItem(character, itemId) {
        const item = DATA.items[itemId];
        if (item) {
            character.inventory.push({ id: itemId, ...item });
            return true;
        }
        return false;
    },

    getResourceCount(character, resourceType) {
        let count = 0;
        for (const item of character.inventory) {
            if (item.type === "material" && item.resource === resourceType) {
                count += item.amount || 1;
            }
        }
        return count;
    },

    consumeResources(character, costs) {
        for (const [resource, needed] of Object.entries(costs)) {
            let remaining = needed;
            for (let i = character.inventory.length - 1; i >= 0 && remaining > 0; i--) {
                const item = character.inventory[i];
                if (item.type === "material" && item.resource === resource) {
                    if (item.amount <= remaining) {
                        remaining -= item.amount;
                        character.inventory.splice(i, 1);
                    } else {
                        item.amount -= remaining;
                        remaining = 0;
                    }
                }
            }
            if (remaining > 0) return false;
        }
        return true;
    },

    canAfford(character, costs) {
        for (const [resource, needed] of Object.entries(costs)) {
            if (this.getResourceCount(character, resource) < needed) return false;
        }
        return true;
    },

    applyDamage(character, amount) {
        character.health = Math.max(0, character.health - amount);
        if (character.health <= 0) {
            character.alive = false;
            character.causeOfDeath = "injuries";
        }
    },

    applySanityChange(character, amount) {
        character.sanity = Math.max(0, Math.min(character.maxSanity, character.sanity + amount));
        if (character.sanity <= 0) {
            character.alive = false;
            character.causeOfDeath = "madness";
        }
    },

    applyInfection(character, amount) {
        character.infection = Math.min(100, Math.max(0, character.infection + amount));
        if (character.infection >= 100) {
            character.alive = false;
            character.causeOfDeath = "turned";
        }
    },

    getMutationTier(character) {
        let currentTier = null;
        for (const tier of DATA.mutationTiers) {
            if (character.infection >= tier.threshold) {
                currentTier = tier;
            }
        }
        return currentTier;
    },

    getStatWithMutations(character, statName) {
        let value = character.stats[statName] || 0;
        const tier = this.getMutationTier(character);
        if (tier && tier.effect) {
            if (statName === "strength" && tier.effect.strengthBonus) value += tier.effect.strengthBonus;
            if (statName === "dexterity" && tier.effect.dexterityBonus) value += tier.effect.dexterityBonus;
        }
        return value;
    }
};
