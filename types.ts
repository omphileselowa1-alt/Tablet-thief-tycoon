
export type TabletRarity = 'Common' | 'Rare' | 'Legendary' | 'Mythic' | 'God' | 'Secret' | 'Tablet Pro' | 'OG' | 'OP' | 'Limited';

export interface Tablet {
  id: string;
  name: string;
  baseIncome: number;
  price: number;
  description: string;
  mutation?: string;
  mutationMultiplier?: number;
  rarity: TabletRarity;
  icon?: string;
  battery?: number; // 0 to 100
}

export interface Weapon {
  id: string;
  name: string;
  price: number | string; // number for game money, string for "Real Money" simulation
  robBoost: number;
  description: string;
}

export interface GamePass {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  effect: 'income' | 'speed' | 'luck' | 'storage';
  multiplier: number;
}

export interface LogEntry {
  id: string;
  message: string;
  timestamp: number;
  type: 'success' | 'failure' | 'info' | 'event' | 'admin';
}

export interface PlayerState {
  x: number;
  y: number;
  speed: number;
  name: string;
  color: string;
}

export interface CraftRecipe {
  id: string;
  targetTabletId: string;
  ingredients: { tabletId: string; count: number }[];
  description: string;
}

export interface TradeRecipe {
  id: string;
  targetTabletId: string;
  ingredients: { tabletId: string; count: number }[];
  description: string;
}

export interface GameState {
  money: number;
  incomePerSec: number;
  ownedTablets: Tablet[];
  ownedWeapons: Weapon[];
  logs: LogEntry[];
  rebirths: number;
}
