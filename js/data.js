// ============================================================
// PROJECT RESURGENCE: THE SILENT ZONE — Game Data
// ============================================================

const DATA = {

  // ── Name Pools ──────────────────────────────────────────────
  firstNamesMale: [
    "Marco", "Jerico", "Rafael", "Andrei", "Miguel", "Carlo", "Darius",
    "Elijah", "Gabriel", "Jonas", "Kevin", "Lance", "Nathaniel", "Paolo",
    "Renzo", "Samuel", "Tristan", "Victor", "Xander", "Zach"
  ],
  firstNamesFemale: [
    "Althea", "Bianca", "Camille", "Daniela", "Elena", "Franchesca",
    "Gabrielle", "Hannah", "Isabelle", "Jasmine", "Katrina", "Lara",
    "Mia", "Nicole", "Patricia", "Regina", "Samantha", "Thea", "Vanessa", "Ysabel"
  ],
  lastNames: [
    "Santos", "Reyes", "Cruz", "Bautista", "Del Rosario", "Gonzales",
    "Ramos", "Aquino", "Garcia", "Mendoza", "Torres", "Rivera",
    "Villanueva", "Tan", "Lim", "Ocampo", "Navarro", "Castillo",
    "Aguilar", "Fernandez"
  ],

  // ── Professions ─────────────────────────────────────────────
  professions: {
    unemployed: {
      name: "Unemployed",
      description: "No special skills, but nothing to unlearn either.",
      statMods: {},
      startingItems: ["energy_bar", "water_bottle", "phone_dead"],
      flavor: "You were between jobs when it happened. Now survival IS the job."
    },
    fire_officer: {
      name: "Fire Officer",
      description: "Trained to run toward danger. Physically elite.",
      statMods: { strength: 2, endurance: 3 },
      startingItems: ["fire_axe", "bandage", "water_bottle"],
      flavor: "You carried people out of burning buildings. Now you carry yourself through hell."
    },
    police: {
      name: "Police Officer",
      description: "Armed response training. You came prepared.",
      statMods: { strength: 1, dexterity: 2, endurance: 1 },
      startingItems: ["pistol", "ammo_9mm", "baton", "flashlight"],
      flavor: "Sworn to protect and serve. There's no one left to take orders from."
    },
    nurse: {
      name: "Nurse",
      description: "Medical training keeps others alive. You start with supplies.",
      statMods: { intelligence: 3, endurance: 1, dexterity: 1 },
      startingItems: ["medkit", "bandage", "bandage", "water_bottle"],
      flavor: "Your hands remember the motions—tourniquet, compress, breathe."
    },
    construction: {
      name: "Construction Worker",
      description: "You know how to build. And how to break.",
      statMods: { strength: 3, endurance: 2 },
      startingItems: ["crowbar", "scrap_x3", "wood_x2", "nails"],
      flavor: "Steel and concrete. You've shaped the city. Now it's crumbling around you."
    },
    mechanic: {
      name: "Mechanic",
      description: "If it has moving parts, you can fix it. Or weaponize it.",
      statMods: { strength: 2, dexterity: 2, intelligence: 1 },
      startingItems: ["wrench", "scrap_x3", "scrap_x3", "duct_tape"],
      flavor: "Engines don't lie. They either work or they don't. Simple as that."
    },
    cook: {
      name: "Chef",
      description: "You can make anything edible. A rare gift in the wasteland.",
      statMods: { intelligence: 1, endurance: 2, sanity: 1 },
      startingItems: ["kitchen_knife", "canned_food", "canned_food", "spices", "rice"],
      flavor: "The last meal you cooked was sinigang. The memory still keeps you warm."
    },
    farmer: {
      name: "Farmer",
      description: "Hands in the earth. Back of steel. You know how to endure.",
      statMods: { strength: 1, endurance: 3, sanity: 1 },
      startingItems: ["hatchet", "canned_food", "rope", "water_bottle"],
      flavor: "The land always provided. Now you'll make it provide again."
    },
    security: {
      name: "Security Guard",
      description: "Trained to watch, wait, and act. The night shift prepared you.",
      statMods: { strength: 2, dexterity: 1, endurance: 2 },
      startingItems: ["baton", "flashlight", "bandage"],
      flavor: "Twelve-hour shifts watching empty halls. At least now the threat is real."
    },
    electrician: {
      name: "Electrician",
      description: "Wire, circuits, power. You understand systems others don't.",
      statMods: { intelligence: 3, dexterity: 2 },
      startingItems: ["wrench", "duct_tape", "scrap_x3", "flashlight"],
      flavor: "People only call you when something breaks. Now everything is broken."
    },
    burglar: {
      name: "Burglar",
      description: "Quick hands, quiet feet. You've always taken what you needed.",
      statMods: { dexterity: 3, intelligence: 1 },
      startingItems: ["lockpick", "flashlight", "backpack", "broken_bottle"],
      flavor: "B&E was your bread and butter. Now it's actual bread you're after."
    },
    veteran: {
      name: "Veteran",
      description: "Combat-hardened. The battlefield changed, the training didn't.",
      statMods: { strength: 2, dexterity: 2, endurance: 2 },
      startingItems: ["machete", "bandage", "water_bottle", "energy_bar"],
      flavor: "You've seen worse. Or maybe not. But you know how to survive it."
    },
    student: {
      name: "Student",
      description: "Young, adaptable, and desperate. The future was supposed to be yours.",
      statMods: { dexterity: 2, intelligence: 1, sanity: 1 },
      startingItems: ["backpack", "energy_bar", "phone_dead"],
      flavor: "Finals week was stressful. This? This is something else entirely."
    },
    teacher: {
      name: "Teacher",
      description: "Knowledge is survival. You can make something from nothing.",
      statMods: { intelligence: 3, sanity: 2 },
      startingItems: ["notebook", "water_bottle", "canned_food"],
      flavor: "You taught them about history's darkest chapters. Now you're living one."
    },
    park_ranger: {
      name: "Park Ranger",
      description: "Wilderness training and survival instincts. You know the land.",
      statMods: { strength: 1, dexterity: 1, endurance: 2, intelligence: 1 },
      startingItems: ["hatchet", "rope", "flashlight", "water_bottle"],
      flavor: "You patrolled trails alone for years. Solitude was never the problem."
    }
  },

  // ── Items ───────────────────────────────────────────────────
  items: {
    // Weapons
    crowbar: { name: "Crowbar", type: "weapon", combatBonus: 15, description: "Heavy, reliable. Opens doors too." },
    wrench: { name: "Wrench", type: "weapon", combatBonus: 10, description: "Not ideal, but it'll crack a skull." },
    kitchen_knife: { name: "Kitchen Knife", type: "weapon", combatBonus: 12, description: "Sharp. Practical. Terrifying." },
    baton: { name: "Baton", type: "weapon", combatBonus: 13, description: "Standard issue. Still effective." },
    machete: { name: "Machete", type: "weapon", combatBonus: 20, description: "Cuts through brush. And bone." },
    pipe: { name: "Lead Pipe", type: "weapon", combatBonus: 8, description: "Crude, but it hits hard." },
    bat: { name: "Baseball Bat", type: "weapon", combatBonus: 14, description: "Aluminum. Dented, but swings true." },
    fire_axe: { name: "Fire Axe", type: "weapon", combatBonus: 22, description: "Red and heavy. Breaks doors and skulls alike." },
    improvised_spear: { name: "Improvised Spear", type: "weapon", combatBonus: 16, description: "A sharpened pipe with cloth grip. Keeps them at arm's length." },
    broken_bottle: { name: "Broken Bottle", type: "weapon", combatBonus: 6, description: "Jagged glass. Desperate, but sharp." },
    katana: { name: "Katana", type: "weapon", combatBonus: 25, description: "Display sword from a collector. Surprisingly sharp." },
    golf_club: { name: "Golf Club", type: "weapon", combatBonus: 11, description: "A 9-iron. Good for distance swings." },
    hatchet: { name: "Hatchet", type: "weapon", combatBonus: 18, description: "Small axe. Quick and deadly." },

    // Guns (require ammo)
    pistol: { name: "Pistol", type: "weapon", combatBonus: 30, ammoType: "ammo_9mm", ammoPerShot: 1, noAmmoBonus: 3, description: "9mm semi-auto. Loud, but lethal.", isGun: true },
    revolver: { name: "Revolver", type: "weapon", combatBonus: 28, ammoType: "ammo_38", ammoPerShot: 1, noAmmoBonus: 3, description: ".38 Special. Six shots. Make them count.", isGun: true },
    shotgun: { name: "Shotgun", type: "weapon", combatBonus: 40, ammoType: "ammo_shells", ammoPerShot: 1, noAmmoBonus: 5, description: "Pump-action. Devastating up close.", isGun: true },
    hunting_rifle: { name: "Hunting Rifle", type: "weapon", combatBonus: 35, ammoType: "ammo_rifle", ammoPerShot: 1, noAmmoBonus: 4, description: "Bolt-action. Patient kills.", isGun: true },

    // Ammo
    ammo_9mm: { name: "9mm Rounds (x6)", type: "ammo", ammoType: "ammo_9mm", amount: 6, description: "Standard pistol ammunition." },
    ammo_38: { name: ".38 Rounds (x6)", type: "ammo", ammoType: "ammo_38", amount: 6, description: "Revolver rounds. Hard to find." },
    ammo_shells: { name: "Shotgun Shells (x4)", type: "ammo", ammoType: "ammo_shells", amount: 4, description: "12-gauge buckshot. Loud." },
    ammo_rifle: { name: "Rifle Rounds (x5)", type: "ammo", ammoType: "ammo_rifle", amount: 5, description: "Hunting caliber. Precise." },

    // Crafted weapons (lower damage than scavenged)
    crafted_spear: { name: "Improvised Spear", type: "weapon", combatBonus: 12, description: "Kitchen knife lashed to a stick. Crude but keeps distance." },
    crafted_club: { name: "Nail Club", type: "weapon", combatBonus: 10, description: "Wood studded with nails. Ugly. Effective." },
    crafted_shiv: { name: "Glass Shiv", type: "weapon", combatBonus: 7, description: "Bottle shard wrapped in cloth. Desperate." },
    crafted_axe: { name: "Makeshift Axe", type: "weapon", combatBonus: 15, description: "Scrap blade bound to a handle. Better than nothing." },

    // Medical
    medkit: { name: "Medkit", type: "medical", healAmount: 35, description: "Professional-grade. Precious." },
    bandage: { name: "Bandage", type: "medical", healAmount: 15, description: "Stops the bleeding, at least." },
    antibiotics: { name: "Antibiotics", type: "medical", infectionCure: 20, description: "Worth more than gold now." },
    antiviral: { name: "Antiviral", type: "medical", infectionCure: 40, description: "Experimental. Might save your humanity." },
    painkillers: { name: "Painkillers", type: "medical", healAmount: 10, sanityRestore: 5, description: "Dulls the pain. Dulls everything." },
    herbs: { name: "Medicinal Herbs", type: "medical", healAmount: 8, description: "Bitter tea, but it helps." },

    // Food
    canned_food: { name: "Canned Food", type: "food", hungerRestore: 30, description: "Corned beef. Expiry date long gone." },
    energy_bar: { name: "Energy Bar", type: "food", hungerRestore: 15, description: "Stale, but calories are calories." },
    rice: { name: "Rice (1 Cup)", type: "food", hungerRestore: 25, requiresCooking: true, description: "Needs to be cooked. A staple." },
    dried_fish: { name: "Dried Fish", type: "food", hungerRestore: 20, description: "Salty and pungent. Lasts forever." },
    rat_meat: { name: "Rat Meat", type: "food", hungerRestore: 20, requiresCooking: true, infectionRisk: 5, description: "Don't think about it. Just eat." },
    spices: { name: "Spices", type: "food", hungerRestore: 0, cookingBonus: true, description: "Makes anything palatable." },

    // Water
    water_bottle: { name: "Clean Water", type: "water", thirstRestore: 40, description: "Clear and safe. Treasure it." },
    dirty_water: { name: "Dirty Water", type: "water", thirstRestore: 30, infectionRisk: 8, description: "Murky. Risky. Better than nothing." },

    // Crafting Materials
    scrap_x3: { name: "Scrap Metal (x3)", type: "material", resource: "scrap", amount: 3, description: "Bent metal, useful for crafting." },
    wood_x2: { name: "Wood (x2)", type: "material", resource: "wood", amount: 2, description: "Splintered boards, but sturdy." },
    duct_tape: { name: "Duct Tape", type: "material", resource: "tape", amount: 1, description: "Fixes everything. Almost." },
    cloth: { name: "Cloth Scraps", type: "material", resource: "cloth", amount: 2, description: "Torn fabric. Many uses." },
    nails: { name: "Box of Nails", type: "material", resource: "nails", amount: 1, description: "Rusty but functional." },
    rope: { name: "Rope (3m)", type: "material", resource: "rope", amount: 1, description: "Frayed but holds weight." },

    // Tools / Misc
    flashlight: { name: "Flashlight", type: "tool", scavengeBonus: 10, description: "Dim beam. Batteries dying." },
    notebook: { name: "Notebook", type: "tool", description: "Scribbled notes. Maps. Reminders of before." },
    backpack: { name: "Backpack", type: "tool", carryBonus: 5, description: "More space. More survival." },
    phone_dead: { name: "Dead Phone", type: "junk", description: "No signal. No power. Just memories in the gallery." },
    lockpick: { name: "Lockpick Set", type: "tool", scavengeBonus: 15, description: "Opens possibilities. And locked doors." },
    candle: { name: "Candle", type: "tool", description: "Weak light, but it keeps the dark at bay. Lasts a few hours." },
  },

  // ── Shelter Upgrades ────────────────────────────────────────
  shelterUpgrades: {
    improvised_bench: {
      name: "Improvised Bench",
      description: "A crude workstation. Opens up basic tool crafting.",
      cost: { scrap: 5 },
      apCost: 6,
      effect: "unlockCrafting",
      icon: "bi-tools"
    },
    alcohol_stove: {
      name: "Alcohol Stove",
      description: "Cook food safely. No more food poisoning.",
      cost: { scrap: 3, wood: 2 },
      apCost: 5,
      requires: "improvised_bench",
      effect: "enableCooking",
      icon: "bi-fire"
    },
    rain_collector: {
      name: "Rain Collector",
      description: "Collects dirty water each day. Must be boiled.",
      cost: { wood: 4, scrap: 2 },
      apCost: 6,
      effect: "dailyWater",
      icon: "bi-cloud-rain-fill"
    },
    barricade: {
      name: "Barricade",
      description: "Reinforced entry points. Reduces raid risk significantly.",
      cost: { wood: 6, scrap: 4, nails: 1 },
      apCost: 8,
      effect: "reduceRaid",
      raidReduction: 30,
      icon: "bi-shield-fill"
    },
    bed_roll: {
      name: "Bed Roll",
      description: "Actual padding. Rest is 50% more effective.",
      cost: { cloth: 4, wood: 2 },
      apCost: 4,
      effect: "betterRest",
      icon: "bi-moon-fill"
    },
    water_filter: {
      name: "Water Filter",
      description: "Purifies dirty water into clean water. No more infection risk.",
      cost: { scrap: 4, cloth: 2, tape: 1 },
      apCost: 6,
      requires: "rain_collector",
      effect: "purifyWater",
      icon: "bi-funnel-fill"
    },
    herb_garden: {
      name: "Herb Garden",
      description: "Grow medicinal herbs over time. Nature provides.",
      cost: { wood: 3, rope: 1 },
      apCost: 5,
      effect: "dailyHerbs",
      icon: "bi-flower1"
    },
    lookout_post: {
      name: "Lookout Post",
      description: "See threats before they arrive. Early warning system.",
      cost: { wood: 5, scrap: 3, rope: 1 },
      apCost: 7,
      requires: "barricade",
      effect: "earlyWarning",
      raidReduction: 20,
      icon: "bi-binoculars-fill"
    }
  },

  // ── Shelter Actions ─────────────────────────────────────────
  shelterActions: {
    clean_debris: {
      name: "Clean Debris",
      description: "Scrounge through the rubble. Might find something useful.",
      apCost: 4,
      loot: [
        { item: "scrap_x3", chance: 40 },
        { item: "wood_x2", chance: 35 },
        { item: "cloth", chance: 20 },
        { item: "nails", chance: 10 },
        { item: "rope", chance: 8 },
      ]
    },
    patch_window: {
      name: "Patch Windows",
      description: "Board up broken windows. Reduces sickness and raid risk.",
      apCost: 6,
      requiresResource: { wood: 2 },
      effect: "reduceExposure",
      maxUses: 3,
      icon: "bi-grid-fill"
    },
    rest: {
      name: "Rest",
      description: "Sleep. Recover health and sanity, but time passes.",
      apCost: 8,
      healthRestore: 10,
      sanityRestore: 8,
      icon: "bi-moon-fill"
    },
    boil_water: {
      name: "Boil Water",
      description: "Purify dirty water on the stove. Requires Alcohol Stove.",
      apCost: 2,
      requires: "alcohol_stove",
      effect: "purifyWater",
      icon: "bi-droplet-half"
    },
    cook_food: {
      name: "Cook Food",
      description: "Prepare raw food safely. Requires Alcohol Stove.",
      apCost: 3,
      requires: "alcohol_stove",
      effect: "cookFood",
      icon: "bi-cup-hot-fill"
    }
  },

  // ── Locations ───────────────────────────────────────────────
  locations: {
    pharmacy: {
      name: "Abandoned Pharmacy",
      description: "Shelves mostly cleared, but the back room might have something.",
      dangerLevel: 2,
      travelAP: 3,
      lootTable: [
        { item: "bandage", chance: 35 },
        { item: "painkillers", chance: 25 },
        { item: "antibiotics", chance: 10 },
        { item: "antiviral", chance: 3 },
        { item: "herbs", chance: 20 },
        { item: "dirty_water", chance: 15 },
      ],
      encounters: ["shambler_guard", "locked_cabinet", "survivor_wounded", "quiet_search"],
      flavor: "The fluorescent lights are dead. Glass crunches underfoot."
    },
    school: {
      name: "Silent School",
      description: "Classrooms frozen in time. The cafeteria might still have food.",
      dangerLevel: 3,
      travelAP: 3,
      lootTable: [
        { item: "canned_food", chance: 25 },
        { item: "water_bottle", chance: 15 },
        { item: "notebook", chance: 20 },
        { item: "cloth", chance: 30 },
        { item: "rope", chance: 10 },
        { item: "bat", chance: 8 },
      ],
      encounters: ["pack_shamblers", "trapped_survivor", "collapse_risk", "quiet_search"],
      flavor: "Children's drawings on the walls. The silence is deafening."
    },
    sarisari: {
      name: "Looted Sari-Sari Store",
      description: "A small neighborhood store. Picked over, but corners remain unchecked.",
      dangerLevel: 1,
      travelAP: 2,
      lootTable: [
        { item: "canned_food", chance: 30 },
        { item: "energy_bar", chance: 25 },
        { item: "rice", chance: 20 },
        { item: "dirty_water", chance: 25 },
        { item: "duct_tape", chance: 10 },
        { item: "spices", chance: 15 },
      ],
      encounters: ["looter_standoff", "quiet_search", "quiet_search", "rat_nest"],
      flavor: "Faded signs advertising load and candy. A different world."
    },
    hospital: {
      name: "Collapsed Hospital",
      description: "Half the building caved in. High risk, but medical supplies await.",
      dangerLevel: 5,
      travelAP: 4,
      lootTable: [
        { item: "medkit", chance: 20 },
        { item: "antibiotics", chance: 18 },
        { item: "antiviral", chance: 8 },
        { item: "bandage", chance: 30 },
        { item: "painkillers", chance: 25 },
        { item: "scrap_x3", chance: 15 },
      ],
      encounters: ["shambler_horde", "shambler_guard", "collapse_risk", "locked_cabinet"],
      flavor: "The stench of antiseptic and decay. Machines beep in empty rooms."
    },
    alley: {
      name: "Dark Alley Network",
      description: "A maze of back streets. Quick loot runs, but you're never alone.",
      dangerLevel: 3,
      travelAP: 2,
      lootTable: [
        { item: "pipe", chance: 20 },
        { item: "scrap_x3", chance: 30 },
        { item: "cloth", chance: 25 },
        { item: "rat_meat", chance: 20 },
        { item: "lockpick", chance: 5 },
        { item: "nails", chance: 15 },
      ],
      encounters: ["shambler_guard", "looter_standoff", "rat_nest", "quiet_search"],
      flavor: "Graffiti fading under grime. Something skitters in the dark."
    },
    market: {
      name: "Flooded Market",
      description: "Knee-deep water. Stalls submerged. Treasures float among the debris.",
      dangerLevel: 4,
      travelAP: 3,
      lootTable: [
        { item: "canned_food", chance: 25 },
        { item: "dried_fish", chance: 20 },
        { item: "wood_x2", chance: 30 },
        { item: "rope", chance: 20 },
        { item: "machete", chance: 5 },
        { item: "dirty_water", chance: 35 },
      ],
      encounters: ["pack_shamblers", "survivor_wounded", "flood_hazard", "quiet_search"],
      flavor: "Water sloshes against rusted stalls. The smell of rotting fish is overwhelming."
    },
    church: {
      name: "Abandoned Church",
      description: "Stained glass shattered. Pews overturned. Something sacred turned profane.",
      dangerLevel: 3,
      travelAP: 3,
      lootTable: [
        { item: "bandage", chance: 25 },
        { item: "water_bottle", chance: 15 },
        { item: "cloth", chance: 35 },
        { item: "canned_food", chance: 20 },
        { item: "candle", chance: 30 },
        { item: "rope", chance: 15 },
      ],
      encounters: ["shambler_guard", "survivor_wounded", "quiet_search", "feral_dogs"],
      flavor: "Candle wax pooled on the floor. Someone was praying here. Recently."
    },
    police_station: {
      name: "Overrun Police Station",
      description: "Barricades breached. Cells open. But the armory might still have something.",
      dangerLevel: 5,
      travelAP: 4,
      lootTable: [
        { item: "baton", chance: 20 },
        { item: "fire_axe", chance: 8 },
        { item: "medkit", chance: 12 },
        { item: "bandage", chance: 25 },
        { item: "flashlight", chance: 15 },
        { item: "scrap_x3", chance: 20 },
        { item: "lockpick", chance: 10 },
      ],
      encounters: ["armored_shambler", "pack_shamblers", "locked_cabinet", "survivor_hostile"],
      flavor: "Bloodstains on the duty desk. The radio still hisses static."
    },
    parking_garage: {
      name: "Underground Parking",
      description: "Three levels deep. Dark. Cold. Echoes carry everything.",
      dangerLevel: 4,
      travelAP: 3,
      lootTable: [
        { item: "scrap_x3", chance: 35 },
        { item: "duct_tape", chance: 20 },
        { item: "wrench", chance: 15 },
        { item: "golf_club", chance: 8 },
        { item: "nails", chance: 20 },
        { item: "dirty_water", chance: 15 },
        { item: "hatchet", chance: 5 },
      ],
      encounters: ["shambler_guard", "gas_leak", "rat_nest", "collapse_risk"],
      flavor: "Oil stains and silence. Your flashlight catches movement between the pillars."
    },
    residential: {
      name: "Residential Ruins",
      description: "A row of collapsed townhouses. Kitchens and bedrooms open to the sky.",
      dangerLevel: 2,
      travelAP: 2,
      lootTable: [
        { item: "canned_food", chance: 25 },
        { item: "kitchen_knife", chance: 10 },
        { item: "cloth", chance: 30 },
        { item: "wood_x2", chance: 25 },
        { item: "water_bottle", chance: 10 },
        { item: "energy_bar", chance: 20 },
        { item: "broken_bottle", chance: 15 },
      ],
      encounters: ["quiet_search", "rat_nest", "feral_dogs", "trapped_survivor"],
      flavor: "Family photos in broken frames. A child's shoe in the rubble."
    }
  },

  // ── Encounters ──────────────────────────────────────────────
  encounters: {
    shambler_guard: {
      title: "The Shambler",
      text: "A lone mutated shambler stands between you and a supply crate. It hasn't noticed you yet. Its head twitches rhythmically.",
      enemyDanger: 15,
      choices: [
        { id: "sneak", label: "Sneak Past", stat: "dexterity", baseDifficulty: 30, successLoot: true, failDamage: 15, failInfection: 15 },
        { id: "fight", label: "Fight It", stat: "strength", baseDifficulty: 25, successLoot: true, failDamage: 25, failInfection: 20, requiresWeapon: true },
        { id: "retreat", label: "Back Away Slowly", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    },
    pack_shamblers: {
      title: "The Pack",
      text: "Three shamblers are clustered around a body. The dead person's bag looks full. The shamblers are... feeding.",
      enemyDanger: 35,
      choices: [
        { id: "sneak", label: "Crawl Past Silently", stat: "dexterity", baseDifficulty: 50, successLoot: true, failDamage: 30, failInfection: 25 },
        { id: "distract", label: "Throw a Distraction", stat: "intelligence", baseDifficulty: 35, successLoot: true, failDamage: 15, failInfection: 10 },
        { id: "retreat", label: "Not Worth It", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    },
    shambler_horde: {
      title: "The Horde",
      text: "You hear them before you see them. Dozens. Shuffling in unison through the corridor. The medical supply room is just beyond them.",
      enemyDanger: 60,
      choices: [
        { id: "sneak", label: "Find Another Way Around", stat: "dexterity", baseDifficulty: 60, successLoot: true, failDamage: 40, failInfection: 30 },
        { id: "distract", label: "Create a Loud Distraction", stat: "intelligence", baseDifficulty: 45, successLoot: true, failDamage: 20, failInfection: 15 },
        { id: "retreat", label: "Turn Back. Now.", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    },
    locked_cabinet: {
      title: "Locked Cabinet",
      text: "A reinforced medicine cabinet, surprisingly intact. The lock looks pickable, or you could try to force it open.",
      enemyDanger: 0,
      choices: [
        { id: "pick", label: "Pick the Lock", stat: "dexterity", baseDifficulty: 35, successLoot: true, bonusLoot: true },
        { id: "force", label: "Force It Open", stat: "strength", baseDifficulty: 30, successLoot: true, noiseAlert: true },
        { id: "leave", label: "Leave It", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    },
    survivor_wounded: {
      title: "Wounded Survivor",
      text: "A woman is slumped against the wall, bleeding from her leg. She looks at you with terrified eyes. \"Please... I have a daughter.\"",
      enemyDanger: 0,
      choices: [
        { id: "help", label: "Help Her (Uses 1 Bandage)", stat: "intelligence", baseDifficulty: 15, cost: "bandage", sanityGain: 10, rewardItem: "canned_food" },
        { id: "trade", label: "Trade Supplies", stat: null, baseDifficulty: 0, trade: true },
        { id: "leave", label: "Walk Away", stat: null, baseDifficulty: 0, sanityLoss: 8 }
      ]
    },
    trapped_survivor: {
      title: "Trapped Behind Rubble",
      text: "Muffled screams from behind a collapsed wall. Someone is alive in there. The rubble is heavy but movable—if you have the strength.",
      enemyDanger: 0,
      choices: [
        { id: "dig", label: "Dig Them Out", stat: "strength", baseDifficulty: 30, sanityGain: 12, rewardItem: "lockpick", apCost: 3 },
        { id: "call", label: "Call Out to Them", stat: "intelligence", baseDifficulty: 20, noiseAlert: true, sanityGain: 5 },
        { id: "leave", label: "You Can't Help Everyone", stat: null, baseDifficulty: 0, sanityLoss: 10 }
      ]
    },
    looter_standoff: {
      title: "The Looter",
      text: "A man with a pipe spots you at the same time you spot him. He's holding a bag of supplies. Neither of you moves.",
      enemyDanger: 20,
      choices: [
        { id: "talk", label: "\"Easy. I'm not looking for trouble.\"", stat: "intelligence", baseDifficulty: 30, successLoot: false, peacefulResolve: true },
        { id: "fight", label: "Rush Him", stat: "strength", baseDifficulty: 35, successLoot: true, failDamage: 20, requiresWeapon: false },
        { id: "retreat", label: "Slowly Back Away", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    },
    rat_nest: {
      title: "Rat Colony",
      text: "A nest of oversized rats occupies a corner near some crates. They're aggressive but small. The crates look promising.",
      enemyDanger: 10,
      choices: [
        { id: "clear", label: "Clear Them Out", stat: "strength", baseDifficulty: 20, successLoot: true, failDamage: 10, failInfection: 5 },
        { id: "sneak", label: "Reach Around Them", stat: "dexterity", baseDifficulty: 25, successLoot: true, failDamage: 8 },
        { id: "retreat", label: "Not Worth a Bite", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    },
    collapse_risk: {
      title: "Unstable Structure",
      text: "The ceiling groans above you. Cracks spider-web across the concrete. Beyond the danger zone, you can see supplies scattered on the floor.",
      enemyDanger: 0,
      choices: [
        { id: "dash", label: "Sprint Through", stat: "dexterity", baseDifficulty: 40, successLoot: true, failDamage: 35 },
        { id: "careful", label: "Move Carefully", stat: "intelligence", baseDifficulty: 30, successLoot: true, apCost: 2, failDamage: 20 },
        { id: "retreat", label: "Too Risky", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    },
    flood_hazard: {
      title: "Rising Waters",
      text: "The water level is rising fast. A floating crate bobs just out of reach. The current is strong.",
      enemyDanger: 0,
      choices: [
        { id: "swim", label: "Swim for It", stat: "endurance", baseDifficulty: 35, successLoot: true, failDamage: 15, failInfection: 10 },
        { id: "fashion", label: "Fashion a Hook", stat: "intelligence", baseDifficulty: 25, successLoot: true, requiresResource: "rope" },
        { id: "retreat", label: "Let It Go", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    },
    quiet_search: {
      title: "Quiet Moment",
      text: "The area seems clear. Dust motes float in shafts of pale light. You have time to search thoroughly.",
      enemyDanger: 0,
      choices: [
        { id: "thorough", label: "Search Carefully", stat: "intelligence", baseDifficulty: 15, successLoot: true, bonusLoot: true },
        { id: "quick", label: "Grab and Go", stat: "dexterity", baseDifficulty: 10, successLoot: true },
        { id: "rest", label: "Take a Breather", stat: null, baseDifficulty: 0, successLoot: false, sanityGain: 3 }
      ]
    },
    feral_dogs: {
      title: "Feral Dog Pack",
      text: "Three dogs slink out from behind a pillar. They're thin, ribs showing, but their eyes are wild. They guard a pile of scattered supplies.",
      enemyDanger: 18,
      choices: [
        { id: "intimidate", label: "Stand Tall, Shout", stat: "strength", baseDifficulty: 25, successLoot: true, failDamage: 15 },
        { id: "bait", label: "Toss Some Food as Distraction", stat: "intelligence", baseDifficulty: 20, successLoot: true, cost: "energy_bar" },
        { id: "retreat", label: "Back Away Slowly", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    },
    armored_shambler: {
      title: "The Tank",
      text: "A shambler in riot gear blocks the corridor. Helmet cracked, shield dented, but still standing. It's bigger than the others. Much bigger.",
      enemyDanger: 45,
      choices: [
        { id: "fight", label: "Go for the Legs", stat: "strength", baseDifficulty: 45, successLoot: true, failDamage: 30, failInfection: 20, requiresWeapon: true },
        { id: "sneak", label: "Find a Way Around", stat: "dexterity", baseDifficulty: 40, successLoot: true, failDamage: 20, failInfection: 15 },
        { id: "retreat", label: "Not Today", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    },
    survivor_hostile: {
      title: "Armed Survivors",
      text: "Two survivors with makeshift weapons block your path. \"Drop your bag and walk away,\" the taller one says. \"Last warning.\"",
      enemyDanger: 30,
      choices: [
        { id: "fight", label: "Fight Them Both", stat: "strength", baseDifficulty: 45, successLoot: true, bonusLoot: true, failDamage: 25, requiresWeapon: true },
        { id: "negotiate", label: "\"Let's trade instead.\"", stat: "intelligence", baseDifficulty: 35, successLoot: false, peacefulResolve: true },
        { id: "flee", label: "Run for It", stat: "dexterity", baseDifficulty: 25, successLoot: false, failDamage: 10, safe: false }
      ]
    },
    gas_leak: {
      title: "Gas Leak",
      text: "The air smells sweet and wrong. A ruptured gas line hisses somewhere in the dark. Supplies are scattered near the leak.",
      enemyDanger: 0,
      choices: [
        { id: "careful", label: "Hold Your Breath, Grab What You Can", stat: "endurance", baseDifficulty: 30, successLoot: true, failDamage: 25 },
        { id: "ventilate", label: "Find and Seal the Leak First", stat: "intelligence", baseDifficulty: 35, successLoot: true, bonusLoot: true, apCost: 2 },
        { id: "retreat", label: "Not Worth the Risk", stat: null, baseDifficulty: 0, successLoot: false, safe: true }
      ]
    }
  },

  // ── Mutation Tiers ──────────────────────────────────────────
  mutationTiers: [
    { threshold: 10, name: "Heightened Senses", description: "Your senses sharpen. Colors seem brighter, sounds clearer.", effect: { scavengeBonus: 10 }, sanityDrain: 0 },
    { threshold: 30, name: "Unnatural Strength", description: "Your muscles feel... wrong. Denser. Stronger. The mirror shows veins you don't remember.", effect: { strengthBonus: 3 }, sanityDrain: 3 },
    { threshold: 50, name: "Night Vision", description: "Darkness no longer blinds you. But the light hurts now.", effect: { nightBonus: 20 }, sanityDrain: 5 },
    { threshold: 70, name: "Feral Instincts", description: "You react before you think. Faster than human. Less than human.", effect: { combatBonus: 15, dexterityBonus: 3 }, sanityDrain: 10 },
    { threshold: 90, name: "The Change", description: "Three days. You can feel it rewriting you. The hunger is unbearable.", effect: { countdown: 3 }, sanityDrain: 20 },
    { threshold: 100, name: "Lost", description: "You have turned.", effect: { gameOver: true }, sanityDrain: 100 },
  ],

  // ── Night Events ────────────────────────────────────────────
  nightEvents: [
    { text: "A distant scream pierces the night. Then silence.", sanityEffect: -3 },
    { text: "Rain hammers the roof. At least the collector is filling up.", sanityEffect: 1 },
    { text: "You dream of home. Of a meal that wasn't from a can.", sanityEffect: 2 },
    { text: "Something scratches at the barricaded door for hours. Then stops.", sanityEffect: -5 },
    { text: "You hear music. A radio, somewhere far away. It gives you hope.", sanityEffect: 4 },
    { text: "A rat crawls across your sleeping area. You're too tired to care.", sanityEffect: -1 },
    { text: "Gunshots in the distance. Three, then nothing.", sanityEffect: -2 },
    { text: "The moon is full. The city looks almost beautiful in the silver light.", sanityEffect: 3 },
    { text: "You can't sleep. The faces of the dead keep you company.", sanityEffect: -4 },
    { text: "A cool breeze flows through the cracks. It smells like rain and ash.", sanityEffect: 0 },
    { text: "You find an old photo in your pocket. A reminder of who you were.", sanityEffect: 2 },
    { text: "The shamblers are louder tonight. More of them. Closer.", sanityEffect: -6 },
  ],

  // ── Raid Events ─────────────────────────────────────────────
  raidEvents: [
    { text: "Looters tried to break in during the night. They took some supplies before fleeing.", stolenItems: 2 },
    { text: "A shambler found a gap in your defenses. You fought it off, but not without cost.", damage: 15, infection: 10 },
    { text: "You heard them trying the door all night. The barricade held. Barely.", stolenItems: 0 },
  ],

  // ── Flavor / Random Events ─────────────────────────────────
  dailyFlavor: [
    "The air tastes like metal today.",
    "Crows circle overhead. They always know.",
    "You notice new cracks in the wall. The building is settling.",
    "A stray dog watches you from across the street. It looks healthy.",
    "The water in the puddles has a strange, oily sheen.",
    "You find a child's toy in the rubble. You leave it where it is.",
    "The temperature dropped overnight. Winter is coming.",
    "Smoke rises from somewhere in the city. Someone's cooking. Or something's burning.",
    "You see fresh footprints near your shelter. Someone knows you're here.",
    "The sky is a sickly yellow-green. The air stings your throat.",
  ],

  // ── Crafting Recipes ─────────────────────────────────────────
  craftingRecipes: {
    crafted_spear: {
      name: "Improvised Spear",
      result: "crafted_spear",
      ingredients: { kitchen_knife: 1, wood_x2: 1, rope: 1 },
      apCost: 4,
      description: "Lash a knife to a stick. Keeps them at arm's length."
    },
    crafted_club: {
      name: "Nail Club",
      result: "crafted_club",
      ingredients: { wood_x2: 1, nails: 1 },
      apCost: 3,
      description: "Drive nails through a plank. Simple. Brutal."
    },
    crafted_shiv: {
      name: "Glass Shiv",
      result: "crafted_shiv",
      ingredients: { broken_bottle: 1, cloth: 1 },
      apCost: 2,
      description: "Wrap a shard in cloth. Quick to make, quick to use."
    },
    crafted_axe: {
      name: "Makeshift Axe",
      result: "crafted_axe",
      ingredients: { scrap_x3: 1, wood_x2: 1, duct_tape: 1 },
      apCost: 5,
      description: "Scrap metal blade bound to a handle. Sturdy."
    },
    crafted_bandage: {
      name: "Improvised Bandage",
      result: "bandage",
      ingredients: { cloth: 2 },
      apCost: 2,
      description: "Clean cloth strips. Better than bleeding out."
    }
  },

  // ── Regions (Towns) ──────────────────────────────────────────
  regions: {
    desolated_town: {
      name: "Desolated Town",
      description: "Your starting area. A dead residential zone.",
      travelAP: 0,
      locations: ["convenience_store", "hospital_wing", "pharmacy", "residential", "church"]
    },
    industrial_zone: {
      name: "Industrial Zone",
      description: "Factories and warehouses. Dangerous, but rich in materials.",
      travelAP: 6,
      locations: ["warehouse", "factory_floor", "parking_garage", "fuel_depot"]
    },
    rural_outskirts: {
      name: "Rural Outskirts",
      description: "Farmland and scattered houses. Quieter. Food is more plentiful.",
      travelAP: 8,
      locations: ["farmhouse", "barn", "roadside_store", "water_tower"]
    },
    military_checkpoint: {
      name: "Military Checkpoint",
      description: "Abandoned army positions. High risk, high reward.",
      travelAP: 10,
      locations: ["police_station", "army_tent", "supply_depot"]
    }
  },

  // ── New Location Data (for new regions) ─────────────────────
  locationsExtra: {
    warehouse: {
      name: "Abandoned Warehouse",
      description: "Rows of shelving stretch into the dark. Something's been nesting here.",
      dangerLevel: 3,
      travelAP: 2,
      lootTable: [
        { item: "scrap_x3", chance: 40 },
        { item: "wood_x2", chance: 30 },
        { item: "duct_tape", chance: 15 },
        { item: "nails", chance: 20 },
        { item: "rope", chance: 15 },
        { item: "wrench", chance: 8 },
      ],
      encounters: ["shambler_guard", "rat_nest", "quiet_search", "collapse_risk"],
      flavor: "Fork lifts rusting in rows. The loading dock doors are jammed."
    },
    factory_floor: {
      name: "Factory Floor",
      description: "Conveyor belts and heavy machinery. A shambler graveyard.",
      dangerLevel: 4,
      travelAP: 3,
      lootTable: [
        { item: "scrap_x3", chance: 45 },
        { item: "nails", chance: 25 },
        { item: "duct_tape", chance: 15 },
        { item: "improvised_spear", chance: 5 },
        { item: "wrench", chance: 12 },
        { item: "cloth", chance: 15 },
      ],
      encounters: ["pack_shamblers", "armored_shambler", "gas_leak", "quiet_search"],
      flavor: "The assembly line still hums. Power from somewhere. Don't touch the wires."
    },
    fuel_depot: {
      name: "Fuel Depot",
      description: "Tanks and pipes. One spark and it's over. But there's gear here.",
      dangerLevel: 5,
      travelAP: 3,
      lootTable: [
        { item: "scrap_x3", chance: 35 },
        { item: "duct_tape", chance: 20 },
        { item: "flashlight", chance: 10 },
        { item: "fire_axe", chance: 5 },
        { item: "medkit", chance: 8 },
      ],
      encounters: ["gas_leak", "survivor_hostile", "shambler_guard", "collapse_risk"],
      flavor: "Warning signs everywhere. Skull and crossbones. You get the idea."
    },
    farmhouse: {
      name: "Abandoned Farmhouse",
      description: "Overgrown yard, sagging roof. The pantry might still have something.",
      dangerLevel: 2,
      travelAP: 2,
      lootTable: [
        { item: "canned_food", chance: 30 },
        { item: "rice", chance: 25 },
        { item: "water_bottle", chance: 20 },
        { item: "dried_fish", chance: 20 },
        { item: "hatchet", chance: 5 },
        { item: "cloth", chance: 15 },
        { item: "herbs", chance: 15 },
      ],
      encounters: ["quiet_search", "feral_dogs", "trapped_survivor", "rat_nest"],
      flavor: "Chickens used to cluck here. Now there's just feathers and silence."
    },
    barn: {
      name: "Old Barn",
      description: "Hay bales and rusted tools. Something large moved through here.",
      dangerLevel: 3,
      travelAP: 2,
      lootTable: [
        { item: "wood_x2", chance: 35 },
        { item: "rope", chance: 25 },
        { item: "hatchet", chance: 8 },
        { item: "cloth", chance: 20 },
        { item: "nails", chance: 15 },
      ],
      encounters: ["feral_dogs", "shambler_guard", "quiet_search", "rat_nest"],
      flavor: "The rafters creak. Dust motes spiral in the light from broken boards."
    },
    roadside_store: {
      name: "Roadside Sari-Sari Store",
      description: "Small but packed. Half-looted, half-forgotten.",
      dangerLevel: 1,
      travelAP: 1,
      lootTable: [
        { item: "canned_food", chance: 25 },
        { item: "energy_bar", chance: 30 },
        { item: "water_bottle", chance: 20 },
        { item: "bandage", chance: 10 },
        { item: "broken_bottle", chance: 15 },
      ],
      encounters: ["quiet_search", "trader_friendly", "feral_dogs"],
      flavor: "Plastic stools out front. A chalkboard menu with today's specials—from months ago."
    },
    water_tower: {
      name: "Water Tower",
      description: "Rusted metal, dangerous climb. But water is life.",
      dangerLevel: 3,
      travelAP: 3,
      lootTable: [
        { item: "dirty_water", chance: 50 },
        { item: "water_bottle", chance: 15 },
        { item: "scrap_x3", chance: 20 },
        { item: "rope", chance: 10 },
      ],
      encounters: ["collapse_risk", "quiet_search", "shambler_guard"],
      flavor: "The ladder rungs are slippery with moss. Don't look down."
    },
    army_tent: {
      name: "Military Field Tent",
      description: "Canvas torn, cots overturned. But military gear is military gear.",
      dangerLevel: 4,
      travelAP: 2,
      lootTable: [
        { item: "bandage", chance: 30 },
        { item: "medkit", chance: 12 },
        { item: "ammo_9mm", chance: 15 },
        { item: "ammo_rifle", chance: 10 },
        { item: "hunting_rifle", chance: 3 },
        { item: "energy_bar", chance: 20 },
      ],
      encounters: ["armored_shambler", "pack_shamblers", "survivor_hostile", "quiet_search"],
      flavor: "Dog tags on the ground. No bodies. That's worse."
    },
    supply_depot: {
      name: "Supply Depot",
      description: "Military supply cache. Heavily contested. Worth the risk.",
      dangerLevel: 5,
      travelAP: 3,
      lootTable: [
        { item: "medkit", chance: 15 },
        { item: "ammo_9mm", chance: 20 },
        { item: "ammo_shells", chance: 10 },
        { item: "ammo_38", chance: 12 },
        { item: "pistol", chance: 5 },
        { item: "shotgun", chance: 3 },
        { item: "antibiotics", chance: 10 },
        { item: "antiviral", chance: 5 },
      ],
      encounters: ["armored_shambler", "survivor_hostile", "pack_shamblers", "armored_shambler"],
      flavor: "Crates stamped 'AFP'. Some opened, some sealed. All worth fighting for."
    }
  },

  // ── Trading Scenarios ────────────────────────────────────────
  tradeEncounters: {
    trader_friendly: {
      title: "Wandering Trader",
      text: "An old man with a heavy pack raises his hands. \"I'm no threat. Just trade. Fair deals only.\" He opens his bag to show his wares.",
      trades: [
        { give: "canned_food", giveQty: 2, receive: "bandage", receiveQty: 1, label: "2 Canned Food → 1 Bandage" },
        { give: "scrap_x3", giveQty: 1, receive: "energy_bar", receiveQty: 2, label: "3 Scrap → 2 Energy Bars" },
        { give: "cloth", giveQty: 1, receive: "water_bottle", receiveQty: 1, label: "2 Cloth → 1 Clean Water" },
      ],
      afterText: "He nods, packs up, and disappears down the alley. Fair deal.",
      dangerAfter: false
    },
    trader_desperate: {
      title: "Desperate Survivor",
      text: "A woman clutches a bleeding arm. \"Please — I need bandages. I'll give you anything.\" She's carrying a loaded bag.",
      trades: [
        { give: "bandage", giveQty: 1, receive: "pistol", receiveQty: 1, label: "1 Bandage → 1 Pistol" },
        { give: "bandage", giveQty: 1, receive: "ammo_9mm", receiveQty: 1, label: "1 Bandage → 6 Rounds (9mm)" },
        { give: "herbs", giveQty: 1, receive: "machete", receiveQty: 1, label: "1 Herbs → 1 Machete" },
      ],
      afterText: "She thanks you with tears in her eyes and limps away. You got the better deal.",
      dangerAfter: false
    },
    trader_suspicious: {
      title: "Shifty Scavenger",
      text: "A man in a torn jacket waves you over. \"Hey, I got good stuff. Real good.\" His eyes keep darting around.",
      trades: [
        { give: "water_bottle", giveQty: 1, receive: "ammo_shells", receiveQty: 1, label: "1 Water → 4 Shotgun Shells" },
        { give: "canned_food", giveQty: 1, receive: "lockpick", receiveQty: 1, label: "1 Food → 1 Lockpick Set" },
      ],
      afterText: "The deal goes through. But as you turn to leave, you hear footsteps behind you...",
      dangerAfter: true,
      ambushChance: 40,
      ambushDamage: 15
    },
    trader_caravan: {
      title: "Survivor Caravan",
      text: "A small group of survivors with a cart offer to trade. They're armed but peaceful. Safety in numbers makes them generous.",
      trades: [
        { give: "scrap_x3", giveQty: 2, receive: "medkit", receiveQty: 1, label: "6 Scrap → 1 Medkit" },
        { give: "energy_bar", giveQty: 2, receive: "antibiotics", receiveQty: 1, label: "2 Energy Bars → 1 Antibiotics" },
        { give: "canned_food", giveQty: 3, receive: "shotgun", receiveQty: 1, label: "3 Canned Food → 1 Shotgun" },
        { give: "water_bottle", giveQty: 2, receive: "ammo_9mm", receiveQty: 1, label: "2 Water → 6 Rounds (9mm)" },
      ],
      afterText: "The caravan moves on. They said there's a safe zone up north. You're not sure you believe them.",
      dangerAfter: false
    }
  }
};
