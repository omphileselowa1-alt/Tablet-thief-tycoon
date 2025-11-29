
import { Tablet, Weapon, GamePass, CraftRecipe, TradeRecipe } from './types';

// Helper to calculate color based on rarity
export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'Common': return '#94a3b8'; // Grey
    case 'Rare': return '#22c55e'; // Green
    case 'Legendary': return '#eab308'; // Gold
    case 'Mythic': return '#a855f7'; // Purple
    case 'God': return '#06b6d4'; // Cyan
    case 'Secret': return '#f43f5e'; // Red
    case 'Tablet Pro': return '#ec4899'; // Pink
    case 'OG': return '#ffffff'; // White
    case 'OP': return '#ff00ff'; // Magenta
    case 'Limited': return '#f97316'; // Orange
    default: return '#94a3b8';
  }
};

export const REBIRTH_TIERS = [
  { level: 1, cost: 1_200_000, multiplier: 1.5 },
  { level: 2, cost: 5_200_000, multiplier: 2.0 },
  { level: 3, cost: 10_100_000, multiplier: 2.5 },
  { level: 4, cost: 150_000_000, multiplier: 3.5 },
  { level: 5, cost: 1_000_000_000, multiplier: 5.0 },
  { level: 6, cost: 5_000_000_000, multiplier: 7.5 },
  { level: 7, cost: 25_000_000_000, multiplier: 10.0 },
  { level: 8, cost: 100_000_000_000, multiplier: 15.0 },
  { level: 9, cost: 500_000_000_000, multiplier: 25.0 },
  { level: 10, cost: 1_000_000_000_000, multiplier: 50.0 },
  { level: 11, cost: 5_000_000_000_000, multiplier: 100.0 },
  { level: 12, cost: 15_000_000_000_000, multiplier: 250.0 },
  { level: 13, cost: 50_000_000_000_000, multiplier: 500.0 },
  { level: 14, cost: 100_000_000_000_000, multiplier: 1_000.0 },
  { level: 15, cost: 250_000_000_000_000, multiplier: 2_500.0 },
  { level: 16, cost: 500_000_000_000_000, multiplier: 5_000.0 },
  { level: 17, cost: 750_000_000_000_000, multiplier: 10_000.0 },
  { level: 18, cost: 900_000_000_000_000, multiplier: 25_000.0 },
  { level: 19, cost: 999_000_000_000_000, multiplier: 50_000.0 },
  { level: 20, cost: 1_100_000_000_000_000, multiplier: 100_000.0 },
];

export const LUCKY_BLOCK_TIERS = [
  { id: 'common', name: 'Common Lucky Block', price: 1000, color: '#94a3b8', description: 'Mostly common items.' },
  { id: 'rare', name: 'Rare Lucky Block', price: 5000, color: '#22c55e', description: 'Better chance for rare items.' },
  { id: 'epic', name: 'Epic Lucky Block', price: 25000, color: '#a855f7', description: 'Good chance for Epics.' },
  { id: 'legendary', name: 'Legendary Lucky Block', price: 100000, color: '#eab308', description: 'High Legendary chance.' },
  { id: 'mythic', name: 'Mythic Lucky Block', price: 1000000, color: '#d946ef', description: 'Contains Mythics.' },
  { id: 'secret', name: 'Secret Lucky Block', price: 500000000, color: '#f43f5e', description: 'High chance for Secrets.' },
  { id: 'og', name: 'OG Lucky Block', price: 10000000000, color: '#ffffff', description: 'The ultimate gamble.' }
];

export const STARTER_PACKS = [
    { 
        id: 'noob_pack', 
        name: 'Noob Starter Pack', 
        price: 100, 
        items: [
            { tabletId: 'paper', count: 10 },
            { tabletId: 'cardboard', count: 5 }
        ],
        description: "A small boost for beginners."
    },
    { 
        id: 'pro_pack', 
        name: 'Pro Thief Pack', 
        price: 5000, 
        items: [
            { tabletId: 'ipad', count: 1 },
            { tabletId: 'surface_pro', count: 1 },
            { tabletId: 'crowbar', count: 1, type: 'weapon' } // Special handling for weapon
        ],
        description: "Get straight to business."
    }
];

// GENERATE 54 MACHINE TABLETS
const MACHINE_TABLETS: Tablet[] = Array.from({ length: 54 }).map((_, i) => ({
    id: `machine_mk${i + 1}`,
    name: `Machine Prototype MK-${i + 1}`,
    baseIncome: 5000 * (i + 1),
    price: 100000 * (i + 1),
    description: `Experimental tablet #${i + 1} from the machine.`,
    rarity: i > 50 ? 'God' : i > 40 ? 'Mythic' : i > 25 ? 'Legendary' : 'Rare',
    icon: '⚙️'
}));

// --- GENERATE 67 READABLE LIMITED TABLETS ---
const LIMITED_PREFIXES = ["Void", "Star", "Nebula", "Quantum", "Cyber", "Neon", "Solar", "Lunar", "Chrono", "Aero", "Hydro", "Terra", "Pyro", "Electro", "Nano", "Giga", "Omega", "Alpha", "Hyper", "Ultra"];
const LIMITED_SUFFIXES = ["Walker", "Slayer", "Engine", "Core", "Shard", "Plate", "Gate", "Key", "Blade", "Shield", "Link", "Mind", "Soul", "Heart", "Eye", "Hand", "Wing", "Claw", "Fang", "Horn"];
const LIMITED_ICONS = ['🏵️', '💠', '🌀', '⚜️', '🔱', '🔰', '⭕', '🧿', '💎', '🛸'];

const LIMITED_TABLETS: Tablet[] = Array.from({ length: 67 }).map((_, i) => {
    const prefix = LIMITED_PREFIXES[i % LIMITED_PREFIXES.length];
    const suffix = LIMITED_SUFFIXES[Math.floor(i / LIMITED_PREFIXES.length) % LIMITED_SUFFIXES.length] || "Relic";
    const name = `The ${prefix} ${suffix}`;
    
    return {
        id: `limited_${i}`,
        name: name,
        baseIncome: 250_000_000 + (i * 5_000_000),
        price: 800_000_000 + (i * 20_000_000),
        description: `Limited Edition Series #${i+1}/67. Collectable.`,
        rarity: 'Limited',
        icon: LIMITED_ICONS[i % LIMITED_ICONS.length]
    };
});

export const TABLETS: Tablet[] = [
  ...MACHINE_TABLETS,
  ...LIMITED_TABLETS,
  
  // --- SPECIAL LIMITED ---
  { id: 'w_or_l', name: "W or L Tablet", baseIncome: 500_000_000, price: 1_000_000_000, description: "Is it a Win or a Loss? 50/50 stats.", rarity: 'Limited', icon: '⚖️' },

  // --- NEW CUSTOM REQUESTS ---
  { id: 'diamond_candy', name: "Diamond Candy", baseIncome: 10_000_000, price: 80_000_000, description: "Sweet and expensive.", rarity: 'God', icon: '🍬', mutationMultiplier: 25 },
  { id: 'diamond_youtube', name: "Diamond YouTube", baseIncome: 15_000_000, price: 100_000_000, description: "Stream in 80K resolution. 30x Multiplier applied.", rarity: 'God', icon: '▶️', mutationMultiplier: 30 },
  { id: 'lava', name: "Lava Tablet", baseIncome: 12_000_000, price: 90_000_000, description: "Don't touch the screen.", rarity: 'God', icon: '🌋', mutationMultiplier: 25 },
  { id: 'galaxy_tab_x', name: "Galaxy X", baseIncome: 14_000_000, price: 95_000_000, description: "Contains a small universe.", rarity: 'God', icon: '🌌', mutationMultiplier: 25 },

  // --- LUCKY BLOCK EXCLUSIVES ---
  { id: 'horrible', name: "The Horrible", baseIncome: 0.1, price: 1, description: "It is terrible. Just awful.", rarity: 'Common', icon: '💩' },
  { id: 'good_tablet', name: "The Good Tablet", baseIncome: 5000, price: 500_000, description: "It's actually quite decent.", rarity: 'Legendary', icon: '👍' },
  { id: 'hotspot', name: "The Hotspot", baseIncome: 500_000, price: 50_000_000, description: "Radiates internet everywhere.", rarity: 'God', icon: '📶' },
  { id: 'la_secret', name: "La Secret Combination", baseIncome: 50_000_000, price: 5_000_000_000, description: "A mystery wrapped in an enigma.", rarity: 'Secret', icon: '🤫' },

  // --- COMMON (Tier 1 & 2) ---
  { id: 'paper', name: "Piece of Paper", baseIncome: 1, price: 10, description: "It has a drawing of a screen on it.", rarity: 'Common', icon: '📄' },
  { id: 'cardboard', name: "Cardboard Cutout", baseIncome: 1, price: 12, description: "Realistic from a distance.", rarity: 'Common', icon: '📦' },
  { id: 'rock', name: "Flat Rock", baseIncome: 1, price: 15, description: "The original tablet. Very durable.", rarity: 'Common', icon: '🪨' },
  { id: 'toast', name: "Burnt Toast", baseIncome: 1, price: 18, description: "Looks like a screen if you squint.", rarity: 'Common', icon: '🍞' },
  { id: 'slate', name: "Chalk Slate", baseIncome: 1, price: 20, description: "School supplies from 1890.", rarity: 'Common', icon: '⬛' },
  { id: 'mirror', name: "Hand Mirror", baseIncome: 2, price: 22, description: "Shows your own reflection.", rarity: 'Common', icon: '🪞' },
  { id: 'calculator', name: "Old Calculator", baseIncome: 2, price: 25, description: "Can spell 80085.", rarity: 'Common', icon: '🧮' },
  { id: 'shingle', name: "Roof Shingle", baseIncome: 2, price: 28, description: "Rough texture.", rarity: 'Common', icon: '🏠' },
  { id: 'etch', name: "Etch-A-Sketch", baseIncome: 2, price: 30, description: "Shake to clear cache.", rarity: 'Common', icon: '〰️' },
  { id: 'tile', name: "Bathroom Tile", baseIncome: 2, price: 32, description: "Cold to the touch.", rarity: 'Common', icon: '⬜' },
  { id: 'tamagotchi', name: "Digital Pet", baseIncome: 2, price: 35, description: "Don't let it die.", rarity: 'Common', icon: '🥚' },
  { id: 'brick', name: "Brick Game", baseIncome: 3, price: 40, description: "9999 in 1 games.", rarity: 'Common', icon: '🧱' },
  { id: 'plate', name: "Dinner Plate", baseIncome: 3, price: 42, description: "Ceramic display.", rarity: 'Common', icon: '🍽️' },
  { id: 'pager', name: "Beeper Pager", baseIncome: 3, price: 45, description: "Only receives numbers.", rarity: 'Common', icon: '📟' },
  { id: 'fire_gen1', name: "Amazon Fire Gen 1", baseIncome: 3, price: 50, description: "Laggy, but functional.", rarity: 'Common', icon: '🕯️' },
  { id: 'mp3', name: "Cheap MP3 Player", baseIncome: 4, price: 55, description: "Holds 12 songs.", rarity: 'Common', icon: '🎵' },
  { id: 'knockoff', name: "Pony Station", baseIncome: 4, price: 60, description: "Cheap knockoff console.", rarity: 'Common', icon: '🎮' },
  { id: 'pda', name: "Palm Pilot", baseIncome: 4, price: 65, description: "Business chic from the 90s.", rarity: 'Common', icon: '🖊️' },
  { id: 'cracked', name: "Shattered iPad", baseIncome: 4, price: 70, description: "The screen cuts your fingers.", rarity: 'Common', icon: '🕸️' },
  { id: 'traffic', name: "Traffic Sign", baseIncome: 5, price: 75, description: "Stolen from the street.", rarity: 'Common', icon: '🛑' },
  { id: 'fire', name: "Amazon Fire HD", baseIncome: 5, price: 80, description: "Basic tablet, low resale value.", rarity: 'Common', icon: '🔥' },
  { id: 'leapfrog', name: "LeapFrog Pad", baseIncome: 5, price: 90, description: "For advanced toddlers.", rarity: 'Common', icon: '🐸' },
  { id: 'nook', name: "Nook Color", baseIncome: 6, price: 110, description: "Remember these?", rarity: 'Common', icon: '📚' },
  { id: 'kindle', name: "E-Reader", baseIncome: 6, price: 120, description: "Black and white screen.", rarity: 'Common', icon: '📖' },
  { id: 'nexus7', name: "Nexus 7", baseIncome: 7, price: 130, description: "A classic Android device.", rarity: 'Common', icon: '🤖' },
  { id: 'blackberry', name: "PlayBook", baseIncome: 7, price: 140, description: "No email client included.", rarity: 'Common', icon: '🍇' },

  // --- RARE (Tier 2 Upper & Tier 3) ---
  { id: 'lenovo', name: "Lenovo Tab", baseIncome: 8, price: 150, description: "Reliable mid-range device.", rarity: 'Rare', icon: '💻' },
  { id: 'asus', name: "ZenPad", baseIncome: 8, price: 160, description: "Decent specs.", rarity: 'Rare', icon: '🖥️' },
  { id: 'galaxy_a', name: "Galaxy Tab A", baseIncome: 9, price: 180, description: "Solid budget choice.", rarity: 'Rare', icon: '🌌' },
  { id: 'honor', name: "Honor Pad", baseIncome: 9, price: 190, description: "Budget friendly.", rarity: 'Rare', icon: '🎖️' },
  { id: 'huawei', name: "Huawei MatePad", baseIncome: 10, price: 200, description: "Popular in overseas markets.", rarity: 'Rare', icon: '🌸' },
  { id: 'xiaomi', name: "Xiaomi Pad 5", baseIncome: 12, price: 220, description: "Great value for money.", rarity: 'Rare', icon: '🍚' },
  { id: 'nokia', name: "Nokia T20", baseIncome: 13, price: 230, description: "Indestructible... maybe.", rarity: 'Rare', icon: '🧱' },
  { id: 'crt', name: "CRT Monitor", baseIncome: 14, price: 240, description: "Heavy and bulky.", rarity: 'Rare', icon: '📺' },
  { id: 'galaxy', name: "Samsung Galaxy Tab S9", baseIncome: 15, price: 250, description: "High-end Android experience.", rarity: 'Rare', icon: '🌠' },
  { id: 'ipad_mini', name: "iPad Mini", baseIncome: 18, price: 280, description: "Small but powerful.", rarity: 'Rare', icon: '🤏' },
  { id: 'ipad', name: "iPad Pro", baseIncome: 20, price: 300, description: "The gold standard of tablets.", rarity: 'Rare', icon: '🍎' },
  { id: 'surface_go', name: "Surface Go", baseIncome: 22, price: 350, description: "A tiny PC in your hand.", rarity: 'Rare', icon: '🧊' },
  { id: 'pixel', name: "Pixel Tablet", baseIncome: 25, price: 400, description: "Comes with a speaker dock.", rarity: 'Rare', icon: '🌈' },
  { id: 'remarkable', name: "ReMarkable 2", baseIncome: 28, price: 450, description: "Paper-like feel.", rarity: 'Rare', icon: '📝' },
  { id: 'steamdeck', name: "Steam Deck", baseIncome: 30, price: 480, description: "It's basically a tablet.", rarity: 'Rare', icon: '🕹️' },
  { id: 'surface_pro', name: "Surface Pro 9", baseIncome: 35, price: 600, description: "Replaces your laptop.", rarity: 'Rare', icon: '💼' },
  { id: 'rog', name: "ROG Flow Z13", baseIncome: 38, price: 700, description: "Gaming tablet.", rarity: 'Rare', icon: '👹' },
  { id: 'galaxy_ultra', name: "Tab S9 Ultra", baseIncome: 40, price: 800, description: "Massive screen real estate.", rarity: 'Rare', icon: '📏' },
  { id: 'ipad_m4', name: "iPad Pro M4", baseIncome: 50, price: 1000, description: "Overkill for candy crush.", rarity: 'Rare', icon: '🚀' },
  { id: 'prototype', name: "Secret Prototype X", baseIncome: 60, price: 1200, description: "Stolen from a top-secret lab.", rarity: 'Rare', icon: '🧪' },

  // --- LEGENDARY (Tier 3 Upper & Tier 4) ---
  { id: 'rugged', name: "Panasonic Toughbook", baseIncome: 65, price: 1300, description: "Can survive a bomb.", rarity: 'Legendary', icon: '🛡️' },
  { id: 'dual_screen', name: "Gemini Duo", baseIncome: 70, price: 1500, description: "Two screens are better than one.", rarity: 'Legendary', icon: '📖' },
  { id: 'fold', name: "Galaxy Z Fold Tab", baseIncome: 80, price: 1800, description: "Folds three times.", rarity: 'Legendary', icon: '📂' },
  { id: 'tough', name: "Military Grade Pad", baseIncome: 90, price: 2000, description: "Bulletproof casing.", rarity: 'Legendary', icon: '🏗️' },
  { id: 'medical', name: "Medi-Slate", baseIncome: 100, price: 2200, description: "Used by surgeons.", rarity: 'Legendary', icon: '🏥' },
  { id: 'industrial', name: "Factory Controller", baseIncome: 120, price: 2500, description: "Controls assembly lines.", rarity: 'Legendary', icon: '🏭' },
  { id: 'gold', name: "24k Gold iPad", baseIncome: 150, price: 3000, description: "Heavy and impractical.", rarity: 'Legendary', icon: '🏆' },
  { id: 'server', name: "Server Blade", baseIncome: 180, price: 3500, description: "Why is this a tablet?", rarity: 'Legendary', icon: '💾' },
  { id: 'satellite', name: "Sat-Link", baseIncome: 190, price: 4000, description: "Direct link to orbit.", rarity: 'Legendary', icon: '📡' },
  { id: 'diamond', name: "Diamond Encrusted Tab", baseIncome: 200, price: 4500, description: "Sparkles distraction.", rarity: 'Legendary', icon: '💎' },
  { id: 'quantum_lite', name: "Quantum Slate Lite", baseIncome: 250, price: 5000, description: "Mines crypto passively.", rarity: 'Legendary', icon: '⚛️' },
  { id: 'artist', name: "Wacom Cintiq Pro", baseIncome: 300, price: 6000, description: "For professional digital art.", rarity: 'Legendary', icon: '🎨' },
  { id: 'crypto', name: "Cold Storage Wallet", baseIncome: 320, price: 7000, description: "Contains lost bitcoin.", rarity: 'Legendary', icon: '🔑' },
  { id: 'fashion', name: "Gucci Smart Slab", baseIncome: 350, price: 8000, description: "You pay for the logo.", rarity: 'Legendary', icon: '👜' },
  { id: 'transparent', name: "Transparent OLED", baseIncome: 400, price: 9000, description: "See-through technology.", rarity: 'Legendary', icon: '🪟' },
  { id: 'hacker_deck', name: "Cyberdeck", baseIncome: 500, price: 12000, description: "Hacks nearby ATMs.", rarity: 'Legendary', icon: '💀' },
  { id: 'holo', name: "Holo-Projector", baseIncome: 600, price: 15000, description: "3D displays in thin air.", rarity: 'Legendary', icon: '👻' },
  { id: 'pipboy', name: "Wrist Computer", baseIncome: 700, price: 20000, description: "Checks radiation levels.", rarity: 'Legendary', icon: '☢️' },
  { id: 'neural', name: "Neural Link Pad", baseIncome: 800, price: 25000, description: "Connects directly to your brain.", rarity: 'Legendary', icon: '🧠' },
  { id: 'implant', name: "Ocular Implant", baseIncome: 900, price: 30000, description: "The screen is in your eye.", rarity: 'Legendary', icon: '👁️' },

  // --- MYTHIC (Tier 4 Upper & Tier 5) ---
  { id: 'flexible', name: "Liquid Screen", baseIncome: 1000, price: 40000, description: "Rolls up like a scroll.", rarity: 'Mythic', icon: '🐍' },
  { id: 'dna', name: "DNA Sequencer", baseIncome: 1200, price: 50000, description: "Edits genes on the fly.", rarity: 'Mythic', icon: '🧬' },
  { id: 'ai_core', name: "AI Core Module", baseIncome: 1500, price: 60000, description: "Sentient operating system.", rarity: 'Mythic', icon: '🤖' },
  { id: 'antigrav', name: "Floating Monitor", baseIncome: 2000, price: 80000, description: "Hovers next to you.", rarity: 'Mythic', icon: '🛸' },
  { id: 'drone', name: "Drone Controller", baseIncome: 2500, price: 90000, description: "Commands an army of drones.", rarity: 'Mythic', icon: '🚁' },
  { id: 'wood_elf', name: "Elven Tablet", baseIncome: 2800, price: 120000, description: "Grown from a sacred tree.", rarity: 'Mythic', icon: '🌳' },
  { id: 'fusion', name: "Nuclear Battery Tab", baseIncome: 3000, price: 150000, description: "Infinite battery life.", rarity: 'Mythic', icon: '☢️' },
  { id: 'forcefield', name: "Shield Generator", baseIncome: 3500, price: 200000, description: "Projects a hard light barrier.", rarity: 'Mythic', icon: '🛡️' },
  { id: 'hardlight', name: "Hardlight Interface", baseIncome: 5000, price: 300000, description: "Touch solid light.", rarity: 'Mythic', icon: '💡' },
  { id: 'dwarven', name: "Dwarven Slate", baseIncome: 5500, price: 400000, description: "Forged in the mountain.", rarity: 'Mythic', icon: '🔨' },
  { id: 'plasma', name: "Plasma Screen", baseIncome: 6000, price: 450000, description: "Hot to the touch.", rarity: 'Mythic', icon: '⚡' },
  { id: 'nanotech', name: "Nanobot Swarm", baseIncome: 8000, price: 600000, description: "Reshapes into any device.", rarity: 'Mythic', icon: '🦠' },
  { id: 'water_elem', name: "Tablet of Water", baseIncome: 9000, price: 700000, description: "Always wet.", rarity: 'Mythic', icon: '💧' },
  { id: 'fire_elem', name: "Tablet of Fire", baseIncome: 10000, price: 800000, description: "Burns with eternal flame.", rarity: 'Mythic', icon: '🔥' },
  { id: 'ice_elem', name: "Tablet of Ice", baseIncome: 11000, price: 900000, description: "Absolute zero cooling.", rarity: 'Mythic', icon: '❄️' },
  { id: 'earth_elem', name: "Tablet of Earth", baseIncome: 11500, price: 950000, description: "Solid as a rock.", rarity: 'Mythic', icon: '🌍' },
  { id: 'air_elem', name: "Tablet of Air", baseIncome: 11800, price: 1_200_000, description: "Light as a feather.", rarity: 'Mythic', icon: '💨' },
  { id: 'martian', name: "Martian Slab", baseIncome: 12000, price: 1_500_000, description: "Dug up from Mars.", rarity: 'Mythic', icon: '👽' },
  { id: 'thunder', name: "Storm Caller", baseIncome: 15000, price: 2_000_000, description: "Charged with lightning.", rarity: 'Mythic', icon: '🌩️' },
  { id: 'void', name: "Void Glass", baseIncome: 20000, price: 3_000_000, description: "Stares back at you.", rarity: 'Mythic', icon: '⚫' },

  // --- GOD (Tier 5 Upper & Tier 6) ---
  { id: 'light', name: "Tablet of Light", baseIncome: 25000, price: 4_000_000, description: "Blindingly bright.", rarity: 'God', icon: '☀️' },
  { id: 'crystal', name: "Atlantean Crystal", baseIncome: 35000, price: 5_000_000, description: "Ancient advanced tech.", rarity: 'God', icon: '🔮' },
  { id: 'demon', name: "Demon Hide", baseIncome: 40000, price: 7_000_000, description: "Smells like sulfur.", rarity: 'God', icon: '👿' },
  { id: 'cursed', name: "Necronomicon Pad", baseIncome: 45000, price: 8_000_000, description: "Bound in... leather.", rarity: 'God', icon: '🧟' },
  { id: 'dragon', name: "Dragon Scale", baseIncome: 48000, price: 9_000_000, description: "Indestructible.", rarity: 'God', icon: '🐉' },
  { id: 'rune', name: "Rune Stone", baseIncome: 50000, price: 10_000_000, description: "Magical income generation.", rarity: 'God', icon: '🗿' },
  { id: 'glitch', name: "MissingNo.", baseIncome: 80000, price: 25_000_000, description: "Corrupts reality.", rarity: 'God', icon: '👾' },
  { id: 'error', name: "404 Tablet", baseIncome: 90000, price: 35_000_000, description: "Item not found.", rarity: 'God', icon: '⚠️' },
  { id: 'bsod', name: "Blue Screen", baseIncome: 95000, price: 40_000_000, description: "Fatal Error.", rarity: 'God', icon: '🟦' },
  { id: 'time', name: "Chrono-Pad", baseIncome: 100000, price: 50_000_000, description: "Mines bitcoin from the future.", rarity: 'God', icon: '⏳' },
  { id: 'portal', name: "Portal Device", baseIncome: 150000, price: 60_000_000, description: "Thinking with portals.", rarity: 'God', icon: '🌀' },
  { id: 'dark_matter', name: "Dark Matter Slate", baseIncome: 200000, price: 80_000_000, description: "Extremely heavy.", rarity: 'God', icon: '🌑' },
  { id: 'antimatter', name: "Antimatter Screen", baseIncome: 250000, price: 90_000_000, description: "Don't drop it.", rarity: 'God', icon: '⚛️' },
  { id: 'blackhole', name: "Singularity", baseIncome: 300000, price: 100_000_000, description: "Spaghettifies fingers.", rarity: 'God', icon: '🕳️' },
  { id: 'star', name: "Neutron Star Fragment", baseIncome: 500000, price: 150_000_000, description: "Radiates pure profit.", rarity: 'God', icon: '⭐' },
  { id: 'supernova', name: "Supernova Remnant", baseIncome: 600000, price: 200_000_000, description: "Blindingly bright.", rarity: 'God', icon: '💥' },
  { id: 'akashic', name: "Akashic Record", baseIncome: 1_000_000, price: 300_000_000, description: "Contains all knowledge.", rarity: 'God', icon: '📚' },
  { id: 'prophecy', name: "The Prophecy", baseIncome: 2_000_000, price: 500_000_000, description: "It was written.", rarity: 'God', icon: '📜' },
  { id: 'grail', name: "Holy Grail Pad", baseIncome: 3_000_000, price: 800_000_000, description: "Choose wisely.", rarity: 'God', icon: '🍷' },
  { id: 'infinity', name: "Infinity Tablet", baseIncome: 5_000_000, price: 1_500_000_000, description: "Snap to delete debt.", rarity: 'God', icon: '♾️' },

  // --- SECRETS (Tier 7) ---
  { id: 'gauntlet', name: "Infinity Gauntlet", baseIncome: 6_000_000, price: 2_500_000_000, description: "Fine, I'll do it myself.", rarity: 'Secret', icon: '🥊' },
  { id: 'multiverse', name: "Multiverse Viewer", baseIncome: 10_000_000, price: 5_000_000_000, description: "Stream TV from other dimensions.", rarity: 'Secret', icon: '🌌' },
  { id: 'timeline', name: "Timeline Editor", baseIncome: 15_000_000, price: 8_000_000_000, description: "Undo your mistakes.", rarity: 'Secret', icon: '🕰️' },
  { id: 'simulation', name: "The Simulation", baseIncome: 20_000_000, price: 10_000_000_000, description: "We are all code.", rarity: 'Secret', icon: '💻' },
  { id: 'matrix', name: "Red Pill", baseIncome: 25_000_000, price: 15_000_000_000, description: "Wake up.", rarity: 'Secret', icon: '💊' },
  { id: 'reality', name: "Reality Bender", baseIncome: 50_000_000, price: 20_000_000_000, description: "Edit the source code of life.", rarity: 'Secret', icon: '🎨' },
  { id: 'genesis', name: "Genesis Block", baseIncome: 60_000_000, price: 40_000_000_000, description: "The beginning.", rarity: 'Secret', icon: '🥚' },
  { id: 'omega', name: "Omega Point", baseIncome: 80_000_000, price: 80_000_000_000, description: "The end.", rarity: 'Secret', icon: 'Ω' },
  { id: 'dream', name: "Dream Shard", baseIncome: 90_000_000, price: 90_000_000_000, description: "Made of pure imagination.", rarity: 'Secret', icon: '☁️' },
  { id: 'dev', name: "The Developer's Laptop", baseIncome: 300_000_000, price: 300_000_000_000, description: "The tool that made this world.", rarity: 'Secret', icon: '👨‍💻' },
  { id: 'admin', name: "Admin Console", baseIncome: 400_000_000, price: 400_000_000_000, description: "/give_money infinite", rarity: 'Secret', icon: '🛠️' },
  { id: 'console', name: "Root Access", baseIncome: 500_000_000, price: 500_000_000_000, description: "sudo rm -rf /", rarity: 'Secret', icon: '⌨️' },
  // NEW SECRETS
  { id: 'banana', name: "Banana Phone", baseIncome: 150_000_000, price: 150_000_000_000, description: "Ring ring ring ring.", rarity: 'Secret', icon: '🍌' },
  { id: 'invisible', name: "Invisible Pad", baseIncome: 200_000_000, price: 200_000_000_000, description: "I can't find it.", rarity: 'Secret', icon: '👻' },

  // --- NEW: TABLET PRO RARITY (Medium Best) ---
  { id: 'pro_max', name: "Tablet Pro Max", baseIncome: 1_000_000_000, price: 5_000_000_000_000, description: "Better than the best.", rarity: 'Tablet Pro', icon: '📱' },
  { id: 'pro_elite', name: "Elite Slate Pro", baseIncome: 2_000_000_000, price: 10_000_000_000_000, description: "Only for professionals.", rarity: 'Tablet Pro', icon: '💼' },
  { id: 'pro_ultra', name: "Ultra Tab Pro", baseIncome: 4_000_000_000, price: 20_000_000_000_000, description: "Maximum productivity.", rarity: 'Tablet Pro', icon: '🚀' },

  // --- OG (The Legends) ---
  { id: 'strawberry', name: "Strawberry Elephant", baseIncome: 1_000_000_000, price: 9_999_999_999_999, description: "THE OG LEGEND. Incomprehensible value.", rarity: 'OG', icon: '🐘' },
  { id: 'horseman', name: "Headless Horseman", baseIncome: 400_000_000, price: 1_200_000_000_000, description: "The cursed tablet. Gives 400M/s.", rarity: 'OG', icon: '🎃' },
  { id: 'walking', name: "Tablets Walking", baseIncome: 250_000_000, price: 500_000_000_000, description: "It grew legs and ran away.", rarity: 'OG', icon: '🏃' },
  { id: 'bird', name: "Flying Bird", baseIncome: 950_000_000, price: 550_000_000_000, description: "It defies gravity.", rarity: 'OG', icon: '🐦' },
  { id: 'six_seven', name: "6 7", baseIncome: 10_500_000_000, price: 5_500_000_000_000, description: "Because 7 8 9.", rarity: 'OG', icon: '🔢' },
  { id: 'la_og', name: "La OG Combination", baseIncome: 100_000_000_000, price: 10_000_000_000_000, description: "The ultimate fusion of legends.", rarity: 'OG', icon: '👑' },
  // NEW OGs
  { id: 'monolith', name: "The Monolith", baseIncome: 2_000_000_000, price: 20_000_000_000_000, description: "Full of stars.", rarity: 'OG', icon: '⬛' },
  { id: 'void_slate', name: "Void Slate", baseIncome: 3_000_000_000, price: 30_000_000_000_000, description: "Absorbs all light.", rarity: 'OG', icon: '🕶️' },

  // --- OP (Overpowered) ---
  { id: 'op_1', name: "Quantum Overlord", baseIncome: 500_000_000_000, price: 50_000_000_000_000, description: "Calculates every possible outcome.", rarity: 'OP', icon: '⚛️' },
  { id: 'op_2', name: "Dimensional Rift", baseIncome: 1_000_000_000_000, price: 100_000_000_000_000, description: "Tears a hole in spacetime.", rarity: 'OP', icon: '🌀' },
  { id: 'op_3', name: "Cosmic Slate", baseIncome: 5_000_000_000_000, price: 500_000_000_000_000, description: "Forged from the Big Bang.", rarity: 'OP', icon: '🌌' },
  { id: 'op_4', name: "Eternity Pad", baseIncome: 10_000_000_000_000, price: 1_000_000_000_000_000, description: "Battery lasts forever. Literally.", rarity: 'OP', icon: '⏳' },
  { id: 'op_5', name: "The Singularity Pro", baseIncome: 50_000_000_000_000, price: 5_000_000_000_000_000, description: "The event horizon of productivity.", rarity: 'OP', icon: '🕳️' },
  { id: 'op_6', name: "God's Canvas", baseIncome: 100_000_000_000_000, price: 10_000_000_000_000_000, description: "Create your own universe.", rarity: 'OP', icon: '🎨' },
  // The Combination
  { id: 'op_combo', name: "The OP Collection", baseIncome: 1_000_000_000_000_000, price: 100_000_000_000_000_000, description: "Power overwhelming.", rarity: 'OP', icon: '👑' },
];

export const CRAFT_RECIPES: CraftRecipe[] = [
  // ... existing recipes
];

export const TRADE_RECIPES: TradeRecipe[] = [
  // ... existing trade recipes
];

export const WEAPONS: Weapon[] = [
  // ... existing weapons
];

export const GAME_PASSES: GamePass[] = [
  // ... existing passes
];

export const EVENTS = [
  // ... existing events
];

export const MUTATIONS = [
  { name: "Common", chance: 0.5, multiplier: 1, color: "#94a3b8" },       // Grey
  { name: "Uncommon", chance: 0.25, multiplier: 1.5, color: "#22c55e" },   // Green
  { name: "Rare", chance: 0.15, multiplier: 3, color: "#3b82f6" },          // Blue
  { name: "Epic", chance: 0.08, multiplier: 10, color: "#a855f7" },        // Purple
  { name: "Legendary", chance: 0.015, multiplier: 50, color: "#eab308" },  // Gold
  { name: "OG", chance: 0.005, multiplier: 500, color: "#ef4444" },         // Red/Special
  { name: "Radioactive", chance: 0.001, multiplier: 50, color: "#39ff14" } // Neon Green
];

export const SPIN_WHEEL_PRIZES = [
    { label: "10x Income (5m)", type: "buff", value: 10 },
    { label: "$1,000,000", type: "money", value: 1000000 },
    { label: "LUCKY BLOCK", type: "item", id: "lucky" },
    { label: "100x Speed (1m)", type: "buff_speed", value: 100 },
    { label: "$100,000,000", type: "money", value: 100000000 },
    { label: "Limited Tablet", type: "item_limited", value: 1 },
    { label: "NOTHING", type: "none", value: 0 },
    { label: "2x LUCK (5m)", type: "buff_luck", value: 2 }
];
