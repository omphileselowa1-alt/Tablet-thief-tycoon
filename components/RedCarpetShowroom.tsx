
import React, { useState, useEffect, useRef } from 'react';
import { Tablet } from '../types';
import { TABLETS, getRarityColor } from '../constants';

interface RedCarpetShowroomProps {
  money: number;
  onBuy: (tablet: Tablet) => void;
  onClose: () => void;
  luckLevel: number;
}

interface WalkingTablet {
  id: number;
  tablet: Tablet;
  x: number;
  speed: number;
}

const RedCarpetShowroom: React.FC<RedCarpetShowroomProps> = ({ money, onBuy, onClose, luckLevel }) => {
  const [items, setItems] = useState<WalkingTablet[]>([]);
  const [selectedItem, setSelectedItem] = useState<WalkingTablet | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  // Spawn Loop
  useEffect(() => {
    const spawnInterval = setInterval(() => {
        // Base Pool (No OGs/Secrets usually)
        let basePool = TABLETS.filter(t => t.rarity !== 'OG' && t.rarity !== 'Secret');
        
        // Luck Logic: Higher luck increases chance of high tier buckets
        // Standard Chances: God (5%), Legendary (15%), Rare (30%), Common (50%)
        const roll = Math.random();
        
        // Adjust probabilities by luck
        const godChance = 0.05 * luckLevel;
        const legChance = 0.15 * luckLevel;
        const rareChance = 0.30 * luckLevel;

        let pool: Tablet[] = [];

        if (roll < godChance) {
             pool = basePool.filter(t => t.rarity === 'God' || t.rarity === 'Mythic');
        } else if (roll < godChance + legChance) {
             pool = basePool.filter(t => t.rarity === 'Legendary');
        } else if (roll < godChance + legChance + rareChance) {
             pool = basePool.filter(t => t.rarity === 'Rare');
        } else {
             pool = basePool.filter(t => t.rarity === 'Common');
        }
        
        // Fallback if pool is empty (shouldn't happen unless luck is weird or data missing)
        if (pool.length === 0) pool = basePool.slice(0, 5);

        const tablet = pool[Math.floor(Math.random() * pool.length)];
        
        const newItem: WalkingTablet = {
            id: nextId.current++,
            tablet: tablet,
            x: -100, // Start off screen left
            speed: 2 + Math.random() * 2
        };

        setItems(prev => [...prev, newItem]);

    }, 1000); // Spawn every second

    return () => clearInterval(spawnInterval);
  }, [luckLevel]);

  // Move Loop
  useEffect(() => {
      const moveInterval = setInterval(() => {
          setItems(prev => prev
            .map(item => ({ ...item, x: item.x + item.speed }))
            .filter(item => item.x < window.innerWidth + 100) // Despawn
          );
      }, 16);
      return () => clearInterval(moveInterval);
  }, []);

  const handleBuy = () => {
      if (selectedItem) {
          if (money >= selectedItem.tablet.price) {
              onBuy(selectedItem.tablet);
              setSelectedItem(null); // Close modal
          }
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black overflow-hidden animate-in fade-in duration-300">
        
        {/* Background / Red Carpet */}
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center perspective-1000">
            {/* The Carpet */}
            <div className="relative w-full h-64 bg-red-700 border-y-8 border-yellow-500 shadow-[0_0_50px_rgba(220,38,38,0.5)] transform -rotate-3 overflow-hidden flex items-center">
                {/* Carpet Texture */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
                
                {/* Walking Items */}
                {items.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="absolute flex flex-col items-center hover:scale-110 transition-transform cursor-pointer"
                        style={{ left: item.x, bottom: 20 }}
                    >
                         {/* Phone Body */}
                         <div 
                            className="w-16 h-24 rounded-lg border-2 bg-slate-800 shadow-xl flex items-center justify-center relative overflow-hidden"
                            style={{ borderColor: getRarityColor(item.tablet.rarity) }}
                         >
                             <div className="text-4xl">{item.tablet.icon || '📱'}</div>
                             {/* Legs Animation CSS */}
                             <div className="absolute -bottom-2 w-full flex justify-center gap-2">
                                 <div className="w-1 h-3 bg-black animate-bounce"></div>
                                 <div className="w-1 h-3 bg-black animate-bounce delay-75"></div>
                             </div>
                         </div>
                         <div className="bg-black/50 text-white text-[10px] px-1 rounded mt-1 backdrop-blur-sm">
                             ${item.tablet.price.toLocaleString()}
                         </div>
                    </button>
                ))}
            </div>

            {/* Velvet Ropes */}
            <div className="absolute top-1/2 w-full h-1 bg-yellow-600/50 -translate-y-32"></div>
            <div className="absolute top-1/2 w-full h-1 bg-yellow-600/50 translate-y-32"></div>
        </div>

        {/* Header UI */}
        <div className="absolute top-0 w-full p-4 flex justify-between items-start pointer-events-none">
            <div className="bg-black/60 p-4 rounded-xl backdrop-blur-md pointer-events-auto">
                <h1 className="text-4xl font-black text-white italic drop-shadow-lg">THE RED CARPET</h1>
                <p className="text-yellow-400 font-bold">Catch a deal!</p>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
                <button 
                    onClick={onClose}
                    className="bg-red-600 text-white font-bold px-6 py-2 rounded-full pointer-events-auto hover:bg-red-500 shadow-lg"
                >
                    LEAVE SHOWROOM
                </button>
                {luckLevel > 1 && (
                    <div className="bg-green-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg animate-pulse flex items-center gap-1">
                        🍀 LUCK: {luckLevel.toFixed(1)}x
                    </div>
                )}
            </div>
        </div>

        {/* Purchase Modal */}
        {selectedItem && (
            <div className="absolute inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-slate-800 border-2 border-white rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-in-center">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.tablet.name}</h2>
                    <div 
                        className="inline-block px-2 py-1 rounded text-xs font-black uppercase mb-4"
                        style={{ backgroundColor: getRarityColor(selectedItem.tablet.rarity), color: 'black' }}
                    >
                        {selectedItem.tablet.rarity}
                    </div>
                    
                    <div className="flex justify-center mb-4 text-6xl">
                        {selectedItem.tablet.icon || '📱'}
                    </div>
                    
                    <div className="space-y-2 mb-6 text-gray-300 text-sm">
                        <p>{selectedItem.tablet.description}</p>
                        <div className="flex justify-between border-t border-gray-600 pt-2">
                            <span>Base Income:</span>
                            <span className="text-green-400 font-bold">+{selectedItem.tablet.baseIncome}/s</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-600 pt-2">
                            <span>Cost:</span>
                            <span className="text-yellow-400 font-bold text-lg">${selectedItem.tablet.price.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={handleBuy}
                            disabled={money < selectedItem.tablet.price}
                            className={`flex-1 py-3 rounded-lg font-bold uppercase ${
                                money >= selectedItem.tablet.price 
                                ? 'bg-green-600 hover:bg-green-500 text-white' 
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {money >= selectedItem.tablet.price ? 'BUY NOW' : 'TOO EXPENSIVE'}
                        </button>
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="flex-1 py-3 rounded-lg font-bold uppercase bg-red-600 hover:bg-red-500 text-white"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default RedCarpetShowroom;
