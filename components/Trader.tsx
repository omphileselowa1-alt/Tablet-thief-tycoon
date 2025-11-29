import React from 'react';
import { Tablet } from '../types';
import { TABLETS, TRADE_RECIPES, getRarityColor } from '../constants';

interface TraderProps {
  ownedTablets: Tablet[];
  onTrade: (consumedIds: string[], reward: Tablet) => void;
  onClose: () => void;
}

const Trader: React.FC<TraderProps> = ({ ownedTablets, onTrade, onClose }) => {
  
  // Count owned items
  const ownedCounts = ownedTablets.reduce((acc, tablet) => {
      const base = TABLETS.find(t => t.name === tablet.name);
      if (base) {
          acc[base.id] = (acc[base.id] || 0) + 1;
      }
      return acc;
  }, {} as Record<string, number>);

  const handleTrade = (recipeId: string) => {
      const recipe = TRADE_RECIPES.find(r => r.id === recipeId);
      if (!recipe) return;

      const canCraft = recipe.ingredients.every(ing => (ownedCounts[ing.tabletId] || 0) >= ing.count);
      if (!canCraft) return;

      const consumedIds: string[] = [];
      recipe.ingredients.forEach(ing => {
          const base = TABLETS.find(t => t.id === ing.tabletId);
          if (base) {
              const instances = ownedTablets.filter(t => t.name === base.name && !consumedIds.includes(t.id));
              for(let i=0; i<ing.count; i++) {
                  if(instances[i]) consumedIds.push(instances[i].id);
              }
          }
      });

      const targetBase = TABLETS.find(t => t.id === recipe.targetTabletId);
      if (targetBase) {
          const reward: Tablet = {
              ...targetBase,
              id: Math.random().toString(36),
              mutation: "Traded",
              mutationMultiplier: 1.5
          };
          onTrade(consumedIds, reward);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in zoom-in duration-300">
      <div className="bg-slate-900 border-4 border-orange-500 rounded-3xl w-full max-w-4xl flex flex-col shadow-[0_0_50px_rgba(249,115,22,0.5)] overflow-hidden h-[90vh]">
        
        <div className="bg-orange-900 p-6 text-center border-b-4 border-orange-700 relative">
            <h2 className="text-3xl font-black text-white italic tracking-widest uppercase">The Tablet Trader</h2>
            <p className="text-orange-200 text-xs font-mono">"I only deal in specific goods. Exact trades only."</p>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full"
            >
                X
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/50">
            {TRADE_RECIPES.map((recipe) => {
                const target = TABLETS.find(t => t.id === recipe.targetTabletId);
                if (!target) return null;

                // Check ingredients
                const requirementsMet = recipe.ingredients.map(ing => {
                    const count = ownedCounts[ing.tabletId] || 0;
                    const required = ing.count;
                    const base = TABLETS.find(t => t.id === ing.tabletId);
                    return {
                        ...ing,
                        name: base?.name || 'Unknown',
                        rarity: base?.rarity || 'Common',
                        icon: base?.icon || '📱',
                        have: count,
                        met: count >= required
                    };
                });

                const canTrade = requirementsMet.every(r => r.met);

                return (
                    <div key={recipe.id} className="bg-slate-900 border border-orange-900/50 rounded-xl p-4 flex flex-col md:flex-row gap-6 hover:border-orange-500/50 transition-colors">
                        
                        {/* Target Preview */}
                        <div className="flex flex-col items-center justify-center min-w-[150px]">
                            <div 
                                className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl shadow-inner mb-2 relative overflow-hidden"
                                style={{ 
                                    backgroundColor: `${getRarityColor(target.rarity)}20`,
                                    border: `2px solid ${getRarityColor(target.rarity)}`
                                }}
                            >
                                <div className="absolute inset-0 animate-pulse opacity-20 bg-white"></div>
                                <span className="relative z-10">{target.icon || '📱'}</span>
                            </div>
                            <h3 className="font-bold text-white text-center">{target.name}</h3>
                            <span 
                                className="text-[10px] font-black uppercase px-2 py-0.5 rounded text-black mt-1"
                                style={{ backgroundColor: getRarityColor(target.rarity) }}
                            >
                                {target.rarity}
                            </span>
                        </div>

                        {/* Ingredients List */}
                        <div className="flex-1 flex flex-col justify-center">
                            <h4 className="text-orange-400 font-bold mb-2 uppercase text-xs tracking-wider">Required Trade Items</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {requirementsMet.map((req, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-black/40 p-2 rounded border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRarityColor(req.rarity) }}></div>
                                            <span className="text-xl">{req.icon}</span>
                                            <span className="text-sm text-gray-300">{req.name}</span>
                                        </div>
                                        <div className={`text-sm font-mono font-bold ${req.met ? 'text-green-500' : 'text-red-500'}`}>
                                            {req.have} / {req.count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-500 text-xs mt-3 italic">{recipe.description}</p>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-center min-w-[150px]">
                            <button
                                onClick={() => handleTrade(recipe.id)}
                                disabled={!canTrade}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-lg transition-all
                                    ${canTrade 
                                        ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)]' 
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                                    }
                                `}
                            >
                                {canTrade ? 'TRADE' : 'LOCKED'}
                            </button>
                        </div>

                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Trader;