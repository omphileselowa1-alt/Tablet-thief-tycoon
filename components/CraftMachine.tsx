
import React, { useState, useEffect } from 'react';
import { Tablet } from '../types';
import { TABLETS, CRAFT_RECIPES, getRarityColor } from '../constants';

interface CraftMachineProps {
  ownedTablets: Tablet[];
  onCraft: (consumedIds: string[], reward: Tablet) => void;
  onClose: () => void;
  money: number;
  onSkipCraft: (cost: number) => void;
}

const CraftMachine: React.FC<CraftMachineProps> = ({ ownedTablets, onCraft, onClose, money, onSkipCraft }) => {
  const [craftingState, setCraftingState] = useState<{
      isActive: boolean;
      endTime: number;
      recipeId: string | null;
      consumedIds: string[];
      reward: Tablet | null;
  }>({ isActive: false, endTime: 0, recipeId: null, consumedIds: [], reward: null });

  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
      let interval: any;
      if (craftingState.isActive) {
          interval = setInterval(() => {
              const remaining = craftingState.endTime - Date.now();
              if (remaining <= 0) {
                  // Done
                  completeCraft();
              } else {
                  const hrs = Math.floor(remaining / 3600000);
                  const mins = Math.floor((remaining % 3600000) / 60000);
                  const secs = Math.floor((remaining % 60000) / 1000);
                  setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
              }
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [craftingState]);

  // Helper to count owned items by type ID
  const ownedCounts = ownedTablets.reduce((acc, tablet) => {
      const base = TABLETS.find(t => t.name === tablet.name);
      if (base) {
          acc[base.id] = (acc[base.id] || 0) + 1;
      }
      return acc;
  }, {} as Record<string, number>);

  const startCraft = (recipeId: string) => {
      const recipe = CRAFT_RECIPES.find(r => r.id === recipeId);
      if (!recipe) return;

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
              mutation: "Crafted",
              mutationMultiplier: 1.5
          };
          
          setCraftingState({
              isActive: true,
              endTime: Date.now() + 3600000, // 1 Hour
              recipeId,
              consumedIds,
              reward
          });
      }
  };

  const completeCraft = () => {
      if (craftingState.reward) {
          onCraft(craftingState.consumedIds, craftingState.reward);
          setCraftingState({ isActive: false, endTime: 0, recipeId: null, consumedIds: [], reward: null });
      }
  };

  const handleSkip = () => {
      if (money >= 100_000_000) {
          onSkipCraft(100_000_000);
          completeCraft();
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in zoom-in duration-300">
      <div className="bg-slate-900 border-4 border-cyan-500 rounded-3xl w-full max-w-4xl flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.5)] overflow-hidden h-[90vh]">
        
        {/* CAMERA VIEW (If Crafting) */}
        {craftingState.isActive ? (
            <div className="flex-1 flex flex-col bg-black relative">
                {/* Camera Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                    <span className="text-red-600 font-mono font-bold animate-pulse">REC • LIVE FEED [CAM-02]</span>
                </div>
                
                <div className="absolute top-4 right-4 text-cyan-400 font-mono text-xl z-10 bg-black/50 px-2 rounded">
                    T-MINUS: {timeLeft}
                </div>

                {/* Viewport */}
                <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    
                    {/* The "Machine" working */}
                    <div className="relative">
                        <div className="w-64 h-64 border-4 border-cyan-500 rounded-full animate-[spin_10s_linear_infinite] opacity-50 absolute inset-0"></div>
                        <div className="w-64 h-64 border-4 border-cyan-300 rounded-full animate-[spin_5s_reverse_infinite] absolute inset-0"></div>
                        
                        <div className="w-64 h-64 flex items-center justify-center flex-col gap-4">
                            <span className="text-6xl animate-bounce">⚙️</span>
                            <span className="text-cyan-400 font-black tracking-widest bg-black px-2">ASSEMBLING...</span>
                        </div>
                    </div>

                    {/* Scanlines */}
                    <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif')] opacity-5 pointer-events-none"></div>
                </div>

                {/* Controls */}
                <div className="p-6 bg-slate-900 border-t border-cyan-900 flex justify-between items-center">
                    <div>
                        <div className="text-gray-400 text-xs">STATUS:</div>
                        <div className="text-yellow-400 font-bold animate-pulse">PROCESSING...</div>
                    </div>
                    
                    <button
                        onClick={handleSkip}
                        disabled={money < 100_000_000}
                        className={`px-6 py-4 rounded-xl font-black uppercase text-lg border-2 flex flex-col items-center ${
                            money >= 100_000_000
                            ? 'bg-yellow-600 hover:bg-yellow-500 border-yellow-400 text-white shadow-[0_0_20px_yellow]'
                            : 'bg-slate-800 border-slate-700 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <span>SKIP WAIT</span>
                        <span className="text-xs opacity-70">$100,000,000</span>
                    </button>
                </div>
            </div>
        ) : (
            // NORMAL RECIPE VIEW
            <>
                <div className="bg-cyan-900 p-6 text-center border-b-4 border-cyan-700 relative">
                    <h2 className="text-3xl font-black text-white italic tracking-widest uppercase">Secret Lab</h2>
                    <p className="text-cyan-200 text-xs font-mono">Combine small tech into legendary items.</p>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full"
                    >
                        X
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/50">
                    {CRAFT_RECIPES.map((recipe) => {
                        const target = TABLETS.find(t => t.id === recipe.targetTabletId);
                        if (!target) return null;

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

                        const canCraft = requirementsMet.every(r => r.met);

                        return (
                            <div key={recipe.id} className="bg-slate-900 border border-cyan-900/50 rounded-xl p-4 flex flex-col md:flex-row gap-6 hover:border-cyan-500/50 transition-colors">
                                
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

                                <div className="flex-1 flex flex-col justify-center">
                                    <h4 className="text-cyan-400 font-bold mb-2 uppercase text-xs tracking-wider">Blueprint</h4>
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
                                    <p className="text-gray-500 text-xs mt-3 italic">"{recipe.description}"</p>
                                    <p className="text-red-400 text-xs mt-1 font-bold">Takes 1 Hour to Craft</p>
                                </div>

                                <div className="flex items-center justify-center min-w-[150px]">
                                    <button
                                        onClick={() => startCraft(recipe.id)}
                                        disabled={!canCraft}
                                        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-lg transition-all
                                            ${canCraft 
                                                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.6)]' 
                                                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                                            }
                                        `}
                                    >
                                        {canCraft ? 'START CRAFT' : 'LOCKED'}
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default CraftMachine;
