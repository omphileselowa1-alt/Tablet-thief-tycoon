
import React, { useState } from 'react';
import { Tablet, TabletRarity } from './types';
import { TABLETS, getRarityColor } from './constants';

interface FuseMachineProps {
  ownedTablets: Tablet[];
  onFuse: (consumedIds: string[], reward: Tablet) => void;
  onClose: () => void;
  fuseLuckActive: boolean;
}

const FuseMachine: React.FC<FuseMachineProps> = ({ ownedTablets, onFuse, onClose, fuseLuckActive }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFusing, setIsFusing] = useState(false);
  
  // Helper to count duplicates for selection UI
  const tabletCounts = ownedTablets.reduce((acc, tablet) => {
    if (!acc[tablet.id]) acc[tablet.id] = { ...tablet, count: 0, instances: [] };
    acc[tablet.id].count++;
    acc[tablet.id].instances.push(tablet.id); // Store actual instance IDs
    return acc;
  }, {} as Record<string, Tablet & { count: number; instances: string[] }>);

  // Helper to handle selection (toggle)
  const toggleSelection = (tabletTypeId: string) => {
    // Find how many of this type are already selected
    const currentlySelectedCount = selectedIds.filter(id => {
       const t2 = ownedTablets.find(owned => owned.id === id);
       return t2?.name === tabletCounts[tabletTypeId].name;
    }).length;

    if (currentlySelectedCount < tabletCounts[tabletTypeId].count) {
        // Select one more of this type
        const availableInstance = ownedTablets.find(t => 
            t.name === tabletCounts[tabletTypeId].name && !selectedIds.includes(t.id)
        );
        if (availableInstance && selectedIds.length < 3) {
            setSelectedIds(prev => [...prev, availableInstance.id]);
        }
    } else {
        // Deselect one
        const instanceToRemove = selectedIds.find(id => {
            const t = ownedTablets.find(owned => owned.id === id);
            return t?.name === tabletCounts[tabletTypeId].name;
        });
        if (instanceToRemove) {
            setSelectedIds(prev => prev.filter(id => id !== instanceToRemove));
        }
    }
  };
  
  const handleSelectType = (typeId: string) => {
      const typeName = tabletCounts[typeId].name;
      const available = ownedTablets.filter(t => t.name === typeName && !selectedIds.includes(t.id));
      
      let newSelected = [...selectedIds];
      
      // If already selected, deselect all of this type
      const existing = selectedIds.filter(id => ownedTablets.find(t => t.id === id)?.name === typeName);
      if (existing.length > 0) {
          newSelected = newSelected.filter(id => !existing.includes(id));
          setSelectedIds(newSelected);
          return;
      }

      // Select up to 3 total
      for (const t of available) {
          if (newSelected.length < 3) {
              newSelected.push(t.id);
          }
      }
      setSelectedIds(newSelected);
  };

  const attemptFuse = () => {
      if (selectedIds.length !== 3) return;
      setIsFusing(true);

      setTimeout(() => {
         let roll = Math.random() * 100;
         let rarity: TabletRarity = 'Common';
         
         if (fuseLuckActive) {
             // 30% CHANCE FOR OG
             if (roll > 70) rarity = 'OG';
             else if (roll > 68) rarity = 'Secret'; 
             else if (roll > 50) rarity = 'God';
             else if (roll > 30) rarity = 'Mythic';
             else if (roll > 10) rarity = 'Legendary';
             else rarity = 'Rare';
         } else {
             // Standard Logic
             if (roll > 99.9) rarity = 'OG';
             else if (roll > 98.4) rarity = 'Secret';
             else if (roll > 83.4) rarity = 'God';
             else if (roll > 40.0) rarity = 'Mythic';
             else if (roll > 20.0) rarity = 'Legendary';
             else if (roll > 5.0) rarity = 'Rare';
             else rarity = 'Common';
         }

         // Pick random tablet of that rarity
         const pool = TABLETS.filter(t => t.rarity === rarity);
         const resultBase = pool[Math.floor(Math.random() * pool.length)];

         const finalReward: Tablet = {
             ...resultBase,
             id: Math.random().toString(36),
             mutation: "Fused",
             mutationMultiplier: 1.1
         };

         onFuse(selectedIds, finalReward);
         setSelectedIds([]);
         setIsFusing(false);
      }, 2000);
  };

  const selectedTablets = selectedIds.map(id => ownedTablets.find(t => t.id === id)).filter(Boolean) as Tablet[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in zoom-in duration-300">
      <div className="bg-slate-900 border-4 border-purple-500 rounded-3xl w-full max-w-2xl flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.5)] overflow-hidden">
        
        <div className="bg-purple-900 p-4 text-center border-b-4 border-purple-700">
            <h2 className="text-3xl font-black text-white italic tracking-widest uppercase">Atomic Fuse</h2>
            <p className="text-purple-200 text-xs font-mono">Combine 3 Tablets -> Get 1 New Tablet</p>
            {fuseLuckActive && <div className="text-yellow-400 font-bold animate-pulse mt-1">🍀 FUSE LUCK EVENT ACTIVE (30% OG!) 🍀</div>}
        </div>

        {/* FUSE ANIMATION AREA */}
        <div className="h-48 bg-black relative flex items-center justify-center gap-4">
            {/* Slot 1 */}
            <div className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center text-gray-700">
                {selectedTablets[0] ? <span className="text-4xl">{selectedTablets[0].icon || '📱'}</span> : '1'}
            </div>
            <div className="text-2xl text-purple-500 font-bold">+</div>
            {/* Slot 2 */}
            <div className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center text-gray-700">
                {selectedTablets[1] ? <span className="text-4xl">{selectedTablets[1].icon || '📱'}</span> : '2'}
            </div>
            <div className="text-2xl text-purple-500 font-bold">+</div>
            {/* Slot 3 */}
            <div className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center text-gray-700">
                {selectedTablets[2] ? <span className="text-4xl">{selectedTablets[2].icon || '📱'}</span> : '3'}
            </div>

            {isFusing && (
                <div className="absolute inset-0 bg-white z-10 animate-ping opacity-20"></div>
            )}
        </div>

        {/* CONTROLS */}
        <div className="p-4 flex justify-center gap-4 bg-slate-800 border-b border-slate-700">
            <button 
                onClick={attemptFuse}
                disabled={selectedIds.length !== 3 || isFusing}
                className={`px-8 py-3 rounded-xl font-black text-xl uppercase tracking-widest transition-all
                    ${selectedIds.length === 3 && !isFusing
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,1)] scale-105' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
                `}
            >
                {isFusing ? 'FUSING...' : 'FUSE'}
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
                {(Object.values(tabletCounts) as (Tablet & { count: number; instances: string[] })[]).map((item) => {
                    // Count how many of this type are selected
                    const selectedCount = selectedIds.filter(id => ownedTablets.find(t => t.id === id)?.name === item.name).length;
                    const isFullySelected = selectedCount >= item.count;
                    const color = getRarityColor(item.rarity);

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleSelectType(item.id)}
                            disabled={isFusing}
                            className={`relative p-2 rounded border flex flex-col items-center gap-1 transition-all
                                ${selectedCount > 0 ? 'bg-purple-900/30 border-purple-500' : 'bg-slate-800 border-slate-700 hover:border-gray-500'}
                            `}
                        >
                            <div className="text-xs font-bold text-gray-400 truncate w-full text-center" style={{color}}>{item.name}</div>
                            <div className="text-2xl">{item.icon || '📱'}</div>
                            <div className="text-[10px] text-gray-500">{selectedCount}/{item.count}</div>
                        </button>
                    )
                })}
            </div>
        </div>

        {/* Rarity Table Legend */}
        <div className="p-2 bg-black text-[9px] text-gray-500 font-mono text-center space-x-2">
            {fuseLuckActive ? (
                <span className="text-yellow-400 font-bold">EVENT ODDS: OG: 30% | MYT: 20% | LEG: 20%</span>
            ) : (
                <>
                    <span>OG: 0.1%</span>
                    <span>SEC: 1.5%</span>
                    <span>GOD: 15%</span>
                    <span>MYT: 40%</span>
                    <span>LEG: 60%</span>
                </>
            )}
        </div>

      </div>
    </div>
  );
};

export default FuseMachine;
