
import React, { useState } from 'react';
import { Tablet, TabletRarity } from '../types';
import { getRarityColor } from '../constants';

interface TabletIndexProps {
  ownedTablets: Tablet[];
  maxStorage: number;
  onClose: () => void;
  onSell: (id: string) => void;
  isVaultMode?: boolean; 
  hasFastCharger: boolean;
  onBuyFastCharger: () => void;
  onChargeAll: () => void;
}

const TabletIndex: React.FC<TabletIndexProps> = ({ 
    ownedTablets, 
    maxStorage, 
    onClose, 
    onSell, 
    isVaultMode = false,
    hasFastCharger,
    onBuyFastCharger,
    onChargeAll
}) => {
  const [filter, setFilter] = useState<TabletRarity | 'All'>('All');

  // Group tablets by type to show counts but we need access to individual IDs for selling
  const tabletCounts = ownedTablets.reduce((acc, tablet) => {
    if (!acc[tablet.id]) {
        acc[tablet.id] = { ...tablet, count: 0, instances: [] };
    }
    acc[tablet.id].count++;
    acc[tablet.id].instances.push(tablet.id);
    return acc;
  }, {} as Record<string, Tablet & { count: number, instances: string[] }>);

  const isFull = ownedTablets.length >= maxStorage;

  // Filter and Sort
  const filteredTablets = (Object.values(tabletCounts) as (Tablet & { count: number, instances: string[] })[])
    .filter(t => filter === 'All' || t.rarity === filter)
    .sort((a, b) => b.price - a.price);

  const categories: TabletRarity[] = ['Common', 'Rare', 'Legendary', 'Mythic', 'God', 'Secret', 'OG', 'OP'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`
        border-4 rounded-xl w-full max-w-5xl flex flex-col shadow-2xl h-[90vh] transition-colors duration-500
        ${isVaultMode ? 'bg-slate-900 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.3)]' : 'bg-slate-900 border-slate-600'}
      `}>
        
        {/* Header */}
        <div className={`p-6 border-b flex justify-between items-center rounded-t-xl shrink-0
            ${isVaultMode ? 'bg-cyan-900/20 border-cyan-800' : 'bg-slate-800 border-slate-700'}
        `}>
          <div className="flex flex-col">
              <h2 className={`text-3xl font-black tracking-widest uppercase flex items-center gap-3
                  ${isVaultMode ? 'text-cyan-400 italic' : 'text-white'}
              `}>
                  {isVaultMode ? '🔐 TITANIUM VAULT' : '🎒 MY BACKPACK'}
              </h2>
              <div className={`text-sm font-mono font-bold mt-1 ${isFull ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                  STORAGE: {ownedTablets.length} / {maxStorage} {isFull && "(FULL!)"}
              </div>
          </div>
          
          <div className="flex gap-2">
               {/* Charge Controls */}
               {!hasFastCharger ? (
                   <button 
                       onClick={onBuyFastCharger}
                       className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg animate-pulse shadow-lg border-2 border-yellow-400"
                   >
                       ⚡ BUY FAST CHARGER ($10,000)
                   </button>
               ) : (
                   <div className="bg-green-900/50 border border-green-500 px-3 py-1 rounded text-green-400 font-bold text-xs flex items-center gap-1">
                       ⚡ FAST CHARGER ACTIVE
                   </div>
               )}
               
               <button 
                   onClick={onChargeAll}
                   className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg"
               >
                   CHARGE ALL TABLETS
               </button>

               <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/10 p-2 rounded-full transition-all w-10 h-10 flex items-center justify-center">
                 X
               </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className={`flex overflow-x-auto p-2 gap-2 border-b shrink-0
            ${isVaultMode ? 'bg-cyan-950/30 border-cyan-900' : 'bg-slate-800/50 border-slate-700'}
        `}>
             <button 
                onClick={() => setFilter('All')}
                className={`px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors border
                    ${filter === 'All' ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white'}
                `}
             >
                ALL
             </button>
             {categories.map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors border
                        ${filter === cat ? 'bg-slate-700 text-white' : 'bg-white/5 text-gray-500 border-transparent hover:border-gray-500'}
                    `}
                    style={{ 
                        borderColor: filter === cat ? getRarityColor(cat) : undefined,
                        color: filter === cat ? getRarityColor(cat) : undefined
                    }}
                 >
                    {cat}
                 </button>
             ))}
        </div>

        {/* Grid Content */}
        <div className={`p-6 overflow-y-auto flex-1
            ${isVaultMode ? 'bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] bg-cyan-900/10' : 'bg-slate-900/50'}
        `}>
          {filteredTablets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                <div className="text-6xl opacity-20">{isVaultMode ? '🔐' : '🎒'}</div>
                <p>No tablets found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredTablets.map((item) => {
                const color = getRarityColor(item.rarity);
                const isSpecial = item.rarity === 'OG' || item.rarity === 'OP';
                const sellPrice = Math.floor(item.price * 0.5);
                const battery = typeof item.battery === 'number' ? item.battery : 100;
                const isDead = battery <= 0;
                
                return (
                  <div 
                    key={item.id} 
                    className={`relative group bg-slate-800 rounded-xl border border-slate-700 hover:border-white transition-all overflow-hidden flex flex-col
                        ${isSpecial ? 'animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''}
                        ${isDead ? 'grayscale opacity-70 border-red-900' : ''}
                    `}
                    style={{ borderColor: isDead ? '#ef4444' : color }}
                  >
                    {/* Count Badge */}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 border border-white/10">
                        x{item.count}
                    </div>

                    {/* Rarity Label */}
                    <div 
                        className="absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded text-black uppercase z-10"
                        style={{ backgroundColor: color }}
                    >
                        {item.rarity}
                    </div>

                    {/* Icon Area */}
                    <div 
                        className="h-28 flex items-center justify-center text-5xl shadow-inner relative"
                        style={{ backgroundColor: `${color}15` }}
                    >
                        {/* Glow effect */}
                        <div 
                            className="absolute inset-0 opacity-20 blur-xl"
                            style={{ backgroundColor: color }}
                        ></div>
                        <span className="relative z-10 drop-shadow-md">{item.icon || '📱'}</span>
                        
                        {/* Dead Battery Overlay */}
                        {isDead && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                <span className="text-3xl animate-pulse">🪫</span>
                            </div>
                        )}
                    </div>

                    {/* Info Area */}
                    <div className="p-3 flex flex-col gap-1 flex-1">
                        <h3 
                            className="font-bold text-xs truncate" 
                            style={{ color: color }}
                            title={item.name}
                        >
                            {item.name}
                        </h3>
                        
                        {/* Battery Bar */}
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1 relative group-hover:h-3 transition-all">
                             <div 
                                className={`h-full transition-all duration-500 ${battery < 20 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${battery}%` }}
                             ></div>
                             <div className="absolute inset-0 text-[8px] flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 leading-none">
                                 {Math.floor(battery)}%
                             </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] mt-1">
                             <span className={`${isDead ? 'text-gray-500 line-through' : 'text-green-400'} font-mono`}>${item.baseIncome}/s</span>
                        </div>
                        <div className="text-[9px] text-gray-500 truncate mt-1">
                            {item.description}
                        </div>
                    </div>
                    
                    {/* Sell Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if(item.instances.length > 0) {
                                onSell(item.instances[0]); // Sell one instance
                            }
                        }}
                        className="bg-red-900/80 hover:bg-red-600 text-red-200 hover:text-white text-[10px] font-bold py-2 uppercase transition-colors border-t border-red-800"
                    >
                        Sell (${sellPrice.toLocaleString()})
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer Index Legend */}
        <div className="p-4 bg-slate-950 rounded-b-xl border-t border-slate-800 flex flex-wrap justify-center gap-4 text-[10px] uppercase font-bold text-gray-500 shrink-0">
            {categories.map(cat => (
                <div key={cat} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRarityColor(cat) }}></div>
                    <span style={{ color: getRarityColor(cat) }}>{cat}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TabletIndex;
