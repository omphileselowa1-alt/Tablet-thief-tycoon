
import React, { useState, useEffect } from 'react';
import { Tablet } from '../types';
import { TABLETS, getRarityColor } from '../constants';

interface QuantumTruckProps {
  isVisible: boolean;
  nextToggleTime: number; // Timestamp when it disappears/appears
  ownedTablets: Tablet[];
  onExchange: (costIds: string[], reward: Tablet) => void;
  onClose: () => void;
}

const QuantumTruck: React.FC<QuantumTruckProps> = ({ isVisible, nextToggleTime, ownedTablets, onExchange, onClose }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [selectedLimited, setSelectedLimited] = useState<Tablet | null>(null);

  // Filter for just Limited tablets
  const limitedTablets = TABLETS.filter(t => t.rarity === 'Limited');

  // Helper to count owned items by name (since IDs are unique)
  const ownedCounts = ownedTablets.reduce((acc, tablet) => {
      acc[tablet.name] = (acc[tablet.name] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
      const interval = setInterval(() => {
          const remaining = Math.max(0, nextToggleTime - Date.now());
          const mins = Math.floor(remaining / 60000);
          const secs = Math.floor((remaining % 60000) / 1000);
          setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(interval);
  }, [nextToggleTime]);

  if (!isVisible) return null;

  const handleExchangeAttempt = (limited: Tablet) => {
      // Determine required ingredient: 
      // Map limited index to a tablet in the main pool.
      // Logic: limited_0 uses TABLETS[0], limited_1 uses TABLETS[1], etc. wrapping around
      const limitedIndex = limitedTablets.findIndex(t => t.id === limited.id);
      
      // Filter out special/unobtainable stuff for ingredients if needed, or just use whole list
      const possibleIngredients = TABLETS.filter(t => t.rarity !== 'Limited' && t.rarity !== 'Secret' && t.rarity !== 'OG' && t.rarity !== 'OP');
      const ingredientBase = possibleIngredients[limitedIndex % possibleIngredients.length];
      
      if (!ingredientBase) return;

      const owned = ownedTablets.filter(t => t.name === ingredientBase.name);
      
      if (owned.length >= 9) {
          // Take first 9 IDs
          const costIds = owned.slice(0, 9).map(t => t.id);
          const reward = {
              ...limited,
              id: Math.random().toString(36),
              mutation: "Quantum",
              mutationMultiplier: 5
          };
          onExchange(costIds, reward);
      }
  };

  const getIngredientInfo = (limited: Tablet) => {
      const limitedIndex = limitedTablets.findIndex(t => t.id === limited.id);
      const possibleIngredients = TABLETS.filter(t => t.rarity !== 'Limited' && t.rarity !== 'Secret' && t.rarity !== 'OG' && t.rarity !== 'OP');
      const ingredientBase = possibleIngredients[limitedIndex % possibleIngredients.length];
      
      const count = ownedCounts[ingredientBase.name] || 0;
      return { base: ingredientBase, count };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
        <div className="bg-slate-900 border-4 border-orange-500 rounded-3xl w-full max-w-6xl flex flex-col shadow-[0_0_80px_rgba(249,115,22,0.4)] overflow-hidden h-[90vh]">
            
            {/* Header */}
            <div className="bg-orange-950 p-6 flex justify-between items-center border-b-4 border-orange-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,#f9731610_20px,#f9731610_40px)] opacity-50"></div>
                
                <div className="z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase drop-shadow-md">
                        UNLIMITED QUANTUM TRUCK
                    </h2>
                    <p className="text-orange-300 font-mono text-xs mt-1">THE VOID MERCHANT IS HERE.</p>
                </div>

                <div className="z-10 flex flex-col items-end">
                    <div className="text-xs font-bold text-orange-400 uppercase">Departing In</div>
                    <div className="text-4xl font-mono font-black text-white animate-pulse">{timeLeft}</div>
                </div>

                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black text-white w-8 h-8 rounded-full font-bold"
                >
                    X
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-black">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {limitedTablets.map((limited) => {
                        const { base: ingredient, count } = getIngredientInfo(limited);
                        const canAfford = count >= 9;

                        return (
                            <div key={limited.id} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-orange-500 transition-all group relative">
                                {/* Header */}
                                <div className="p-3 bg-slate-800 flex justify-between items-start">
                                    <div>
                                        <div className="text-orange-400 text-[10px] font-black uppercase tracking-widest">LIMITED EDITION</div>
                                        <div className="text-white font-bold leading-tight">{limited.name}</div>
                                    </div>
                                    <div className="text-2xl">{limited.icon}</div>
                                </div>

                                {/* Cost Area */}
                                <div className="p-4 flex flex-col gap-2">
                                    <div className="text-[10px] text-gray-500 font-mono uppercase text-center">EXCHANGE COST</div>
                                    
                                    <div className={`border-2 rounded-lg p-2 flex items-center justify-between ${canAfford ? 'border-green-500 bg-green-900/10' : 'border-red-900 bg-red-900/10'}`}>
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="text-xl">{ingredient.icon}</div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-300 truncate w-24">{ingredient.name}</span>
                                                <span className="text-[9px] text-gray-500">{ingredient.rarity}</span>
                                            </div>
                                        </div>
                                        <div className={`font-mono font-black text-lg ${canAfford ? 'text-green-400' : 'text-red-500'}`}>
                                            {count}/9
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleExchangeAttempt(limited)}
                                        disabled={!canAfford}
                                        className={`w-full py-3 rounded font-black uppercase tracking-widest mt-2 transition-all
                                            ${canAfford 
                                                ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_15px_orange]' 
                                                : 'bg-slate-800 text-gray-600 cursor-not-allowed border border-slate-700'
                                            }
                                        `}
                                    >
                                        {canAfford ? 'TRADE' : 'LOCKED'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    </div>
  );
};

export default QuantumTruck;
