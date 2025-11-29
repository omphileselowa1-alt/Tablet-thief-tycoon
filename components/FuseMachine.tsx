
import React, { useState, useEffect } from 'react';
import { Tablet, TabletRarity } from '../types';
import { TABLETS, getRarityColor } from '../constants';

interface FuseMachineProps {
  ownedTablets: Tablet[];
  onFuse: (consumedIds: string[], reward: Tablet) => void;
  onClose: () => void;
  fuseLuckActive: boolean;
  money: number;
  onSkipFuse: (cost: number) => void;
}

const FuseMachine: React.FC<FuseMachineProps> = ({ ownedTablets, onFuse, onClose, fuseLuckActive, money, onSkipFuse }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [fusingState, setFusingState] = useState<{
      isActive: boolean;
      endTime: number;
      reward: Tablet | null;
      consumedIds: string[];
  }>({ isActive: false, endTime: 0, reward: null, consumedIds: [] });

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    let interval: any;
    if (fusingState.isActive) {
        interval = setInterval(() => {
            const remaining = fusingState.endTime - Date.now();
            if (remaining <= 0) {
                completeFuse();
            } else {
                const hrs = Math.floor(remaining / 3600000);
                const mins = Math.floor((remaining % 3600000) / 60000);
                const secs = Math.floor((remaining % 60000) / 1000);
                setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
            }
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [fusingState]);
  
  // Group by name for display, but keep track of all IDs
  const tabletGroups = ownedTablets.reduce((acc, tablet) => {
    if (!acc[tablet.name]) {
        acc[tablet.name] = { 
            base: tablet, 
            ids: [] 
        };
    }
    acc[tablet.name].ids.push(tablet.id);
    return acc;
  }, {} as Record<string, { base: Tablet, ids: string[] }>);

  
  const handleSelectType = (name: string) => {
      if (fusingState.isActive) return;

      const group = tabletGroups[name];
      if (!group) return;

      // Find ids of this group that are ALREADY selected
      const selectedOfThisGroup = selectedIds.filter(id => group.ids.includes(id));
      
      // If we have selected all available instances, we can't select more
      if (selectedOfThisGroup.length >= group.ids.length) {
          // Deselect one
          const toRemove = selectedOfThisGroup[0];
          setSelectedIds(prev => prev.filter(id => id !== toRemove));
      } else {
          // Select one more if total selected < 3
          if (selectedIds.length < 3) {
              const nextAvailableId = group.ids.find(id => !selectedIds.includes(id));
              if (nextAvailableId) {
                  setSelectedIds(prev => [...prev, nextAvailableId]);
              }
          }
      }
  };

  const startFuse = () => {
      if (selectedIds.length !== 3) return;

      // Determine Outcome Immediately but reveal later
      let roll = Math.random() * 100;
      let rarity: TabletRarity = 'Common';
         
      if (fuseLuckActive) {
          if (roll > 70) rarity = 'OG';
          else if (roll > 68) rarity = 'Secret'; 
          else if (roll > 50) rarity = 'God';
          else if (roll > 30) rarity = 'Mythic';
          else if (roll > 10) rarity = 'Legendary';
          else rarity = 'Rare';
      } else {
          if (roll > 99.9) rarity = 'OG';
          else if (roll > 98.4) rarity = 'Secret';
          else if (roll > 83.4) rarity = 'God';
          else if (roll > 40.0) rarity = 'Mythic';
          else if (roll > 20.0) rarity = 'Legendary';
          else if (roll > 5.0) rarity = 'Rare';
          else rarity = 'Common';
      }

      const pool = TABLETS.filter(t => t.rarity === rarity);
      const resultBase = pool[Math.floor(Math.random() * pool.length)] || TABLETS[0];

      const finalReward: Tablet = {
          ...resultBase,
          id: Math.random().toString(36),
          mutation: "Fused",
          mutationMultiplier: 1.1
      };

      setFusingState({
          isActive: true,
          endTime: Date.now() + 3600000, // 1 Hour
          consumedIds: [...selectedIds],
          reward: finalReward
      });
      
      setSelectedIds([]);
  };

  const completeFuse = () => {
      if (fusingState.reward) {
          onFuse(fusingState.consumedIds, fusingState.reward);
          setFusingState({ isActive: false, endTime: 0, consumedIds: [], reward: null });
      }
  };

  const handleSkip = () => {
      if (money >= 100_000_000) {
          onSkipFuse(100_000_000);
          completeFuse();
      }
  };

  const selectedTablets = selectedIds.map(id => ownedTablets.find(t => t.id === id)).filter(Boolean) as Tablet[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in zoom-in duration-300">
      <div className="bg-purple-950 border-4 border-purple-500 rounded-3xl w-full max-w-2xl flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.5)] overflow-hidden h-[80vh]">
        
        {fusingState.isActive ? (
             <div className="flex-1 flex flex-col bg-black relative">
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                    <span className="text-red-600 font-mono font-bold animate-pulse">REC • CAULDRON CAM [CAM-03]</span>
                </div>
                
                <div className="absolute top-4 right-4 text-purple-400 font-mono text-xl z-10 bg-black/50 px-2 rounded">
                    T-MINUS: {timeLeft}
                </div>

                <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,black_80%)]"></div>
                    <div className="relative">
                        <div className="w-48 h-48 rounded-full bg-purple-900/50 animate-pulse blur-xl"></div>
                        <div className="text-6xl animate-bounce absolute inset-0 flex items-center justify-center">🧪</div>
                    </div>
                    <div className="absolute bottom-10 text-purple-300 font-mono animate-pulse">FUSING MOLECULES...</div>
                </div>

                <div className="p-6 bg-slate-900 border-t border-purple-900 flex justify-between items-center">
                    <div>
                        <div className="text-gray-400 text-xs">STATUS:</div>
                        <div className="text-purple-400 font-bold animate-pulse">BREWING...</div>
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
            <>
                <div className="bg-purple-900 p-4 text-center border-b-4 border-purple-700">
                    <h2 className="text-3xl font-black text-white italic tracking-widest uppercase">Witch's Fuse Pot</h2>
                    <p className="text-purple-200 text-xs font-mono">Select 3 items to combine.</p>
                    {fuseLuckActive && <div className="text-yellow-400 font-bold animate-pulse mt-1">🍀 WITCH MAGIC ACTIVE (30% OG!) 🍀</div>}
                </div>

                {/* FUSE ANIMATION AREA */}
                <div className="h-48 bg-black relative flex items-center justify-center gap-4 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] shrink-0">
                    {[0, 1, 2].map(idx => (
                        <React.Fragment key={idx}>
                            <div className="w-20 h-20 border-2 border-dashed border-purple-600 rounded-full flex items-center justify-center text-gray-700 bg-purple-900/20 overflow-hidden">
                                {selectedTablets[idx] ? (
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl">{selectedTablets[idx].icon}</span>
                                        <span className="text-[8px] text-white truncate w-16 text-center">{selectedTablets[idx].name}</span>
                                    </div>
                                ) : (
                                    <span className="text-xl font-bold">{idx + 1}</span>
                                )}
                            </div>
                            {idx < 2 && <div className="text-2xl text-purple-500 font-bold">+</div>}
                        </React.Fragment>
                    ))}
                </div>

                {/* CONTROLS */}
                <div className="p-4 flex justify-center gap-4 bg-purple-900/50 border-b border-purple-700 shrink-0">
                    <button 
                        onClick={startFuse}
                        disabled={selectedIds.length !== 3}
                        className={`px-8 py-3 rounded-xl font-black text-xl uppercase tracking-widest transition-all
                            ${selectedIds.length === 3
                                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,1)] scale-105' 
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
                        `}
                    >
                        START FUSE
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold bg-slate-700 text-gray-300 hover:bg-slate-600"
                    >
                        EXIT
                    </button>
                </div>

                {/* INVENTORY SELECTOR */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-900">
                    <div className="grid grid-cols-4 gap-2">
                        {(Object.values(tabletGroups) as { base: Tablet, ids: string[] }[]).map((group) => {
                            const selectedCount = selectedIds.filter(id => group.ids.includes(id)).length;
                            const color = getRarityColor(group.base.rarity);

                            return (
                                <button
                                    key={group.base.name}
                                    onClick={() => handleSelectType(group.base.name)}
                                    className={`relative p-2 rounded border flex flex-col items-center gap-1 transition-all
                                        ${selectedCount > 0 ? 'bg-purple-900/30 border-purple-500' : 'bg-slate-800 border-slate-700 hover:border-gray-500'}
                                    `}
                                >
                                    <div className="text-xs font-bold text-gray-400 truncate w-full text-center" style={{color}}>{group.base.name}</div>
                                    <div className="text-2xl">{group.base.icon || '📱'}</div>
                                    <div className="text-[10px] text-gray-500">{selectedCount}/{group.ids.length}</div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default FuseMachine;
