
import React, { useState, useEffect, useRef } from 'react';
import { Tablet } from '../types';
import { TABLETS, getRarityColor, LUCKY_BLOCK_TIERS } from '../constants';

interface LuckyBlockOpenerProps {
  blockType: string;
  onComplete: (reward: Tablet) => void;
  onClose: () => void;
  luckLevel?: number; // 1 = Normal, 10 = High (Global Admin Luck)
}

const LuckyBlockOpener: React.FC<LuckyBlockOpenerProps> = ({ blockType, onComplete, onClose, luckLevel = 1 }) => {
  const [stage, setStage] = useState<'shaking' | 'rolling' | 'revealed'>('shaking');
  const [displayItem, setDisplayItem] = useState<{name: string, icon: string}>({ name: "?", icon: "❓" });
  const [finalItem, setFinalItem] = useState<Tablet | null>(null);

  // Animation Refs
  const rollInterval = useRef<any>(null);

  const blockInfo = LUCKY_BLOCK_TIERS.find(t => t.id === blockType) || LUCKY_BLOCK_TIERS[0];

  useEffect(() => {
    // 1. Shake Phase
    const shakeTimer = setTimeout(() => {
        setStage('rolling');
        startRolling();
    }, 800);

    return () => clearTimeout(shakeTimer);
  }, []);

  const startRolling = () => {
    // 2. Roll Phase - Cycle names rapidly
    let count = 0;
    // Items to flash during roll
    const previewItems = [
        { name: "The Horrible", icon: "💩" },
        { name: "The Good Tablet", icon: "👍" },
        { name: "The Hotspot", icon: "📶" },
        { name: "La Secret", icon: "🤫" },
        { name: "La OG", icon: "👑" },
        { name: "Quantum Overlord", icon: "⚛️" },
        { name: "???", icon: "❓" }
    ];

    rollInterval.current = setInterval(() => {
        setDisplayItem(previewItems[count % previewItems.length]);
        count++;
    }, 80);

    // Stop rolling after 2.0 seconds
    setTimeout(() => {
        if (rollInterval.current) clearInterval(rollInterval.current);
        determineWinner();
    }, 2000);
  };

  const determineWinner = () => {
    // Rarity Weights based on Block Type
    // Simple weighted logic
    const weights: Record<string, any> = {
        'common': { Common: 80, Rare: 15, Legendary: 4, Mythic: 0.9, God: 0.09, Secret: 0.01, OG: 0, OP: 0 },
        'rare': { Common: 50, Rare: 40, Legendary: 8, Mythic: 1.5, God: 0.4, Secret: 0.1, OG: 0, OP: 0 },
        'epic': { Common: 30, Rare: 40, Legendary: 20, Mythic: 8, God: 1.5, Secret: 0.4, OG: 0.1, OP: 0 },
        'legendary': { Common: 10, Rare: 20, Legendary: 40, Mythic: 20, God: 8, Secret: 1.5, OG: 0.5, OP: 0 },
        'mythic': { Common: 0, Rare: 10, Legendary: 30, Mythic: 40, God: 15, Secret: 4, OG: 1, OP: 0 },
        'secret': { Common: 0, Rare: 0, Legendary: 10, Mythic: 30, God: 30, Secret: 20, OG: 10, OP: 0 },
        'og': { Common: 0, Rare: 0, Legendary: 0, Mythic: 10, God: 20, Secret: 30, OG: 40, OP: 0.1 }, // Tiny chance for OP in OG block
    };

    const currentWeights = weights[blockType] || weights['common'];
    
    // Create a pool based on weights
    const pool: string[] = [];
    // Order: OP -> OG -> Secret -> God -> Mythic -> Legendary -> Rare -> Common
    const checkOrder = ['OP', 'OG', 'Secret', 'God', 'Mythic', 'Legendary', 'Rare', 'Common'];
    
    for (const r of checkOrder) {
        let weight = currentWeights[r] || 0;
        
        // Apply Luck Multiplier
        if (luckLevel > 1) {
             if (r === 'OP' || r === 'OG' || r === 'Secret' || r === 'God') weight *= luckLevel;
        }

        // Add to pool (x10 for granularity)
        for(let i=0; i < Math.floor(weight * 10); i++) pool.push(r);
    }
    
    // Default fallback
    if (pool.length === 0) pool.push('Common');

    const targetRarity = pool[Math.floor(Math.random() * pool.length)];

    // Pick specific item of that rarity
    const itemPool = TABLETS.filter(t => t.rarity === targetRarity);
    const winner = itemPool.length > 0 
        ? itemPool[Math.floor(Math.random() * itemPool.length)] 
        : TABLETS[0];

    if (winner) {
        setFinalItem(winner);
        setStage('revealed');
    }
  };

  const handleClaim = () => {
      if (finalItem) {
          onComplete(finalItem);
      }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 animate-in fade-in duration-300">
      
      {/* Container */}
      <div className="flex flex-col items-center justify-center w-full max-w-4xl text-center p-8 h-[90vh]">
        
        <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 animate-pulse drop-shadow-lg" style={{ color: blockInfo.color }}>
            {blockInfo.name}
        </h2>

        {/* Visual Box */}
        <div 
            className={`
                w-64 h-64 md:w-80 md:h-80 rounded-3xl mb-8 flex items-center justify-center text-9xl shadow-[0_0_80px_rgba(255,255,255,0.2)] border-8 bg-slate-900 relative transition-all duration-300
                ${stage === 'shaking' ? 'animate-bounce' : ''}
                ${stage === 'rolling' ? 'animate-[spin_1s_linear_infinite]' : ''} 
                ${stage === 'revealed' ? 'animate-[bounce_1s_infinite] border-white shadow-[0_0_150px_white]' : ''}
            `}
            style={{ borderColor: blockInfo.color, boxShadow: `0 0 50px ${blockInfo.color}50` }}
        >
            {stage === 'revealed' && finalItem ? (
                // Revealed Visual
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-2xl animate-in zoom-in duration-500">
                     <div className="absolute inset-0 bg-white animate-ping opacity-50"></div>
                     <span className="relative z-10 drop-shadow-2xl scale-150">{finalItem.icon || '📱'}</span>
                     <div className="absolute bottom-4 text-xl font-black uppercase bg-black/50 px-4 py-1 rounded border border-white/20">
                        {finalItem.rarity}
                     </div>
                </div>
            ) : (
                // Mystery Visual
                <div className="font-black drop-shadow-lg" style={{ color: blockInfo.color }}>
                    {stage === 'rolling' ? displayItem.icon : '?'}
                </div>
            )}
        </div>

        {/* Rolling Text */}
        <div className="h-20 overflow-hidden mb-8 flex items-center justify-center">
            <div className={`font-mono font-black text-white transition-all text-center
                ${stage === 'revealed' ? 'scale-125 text-5xl text-green-400' : 'text-4xl'}
            `}>
                {stage === 'revealed' ? finalItem?.name : displayItem.name}
            </div>
        </div>

        {stage === 'revealed' ? (
             <button 
                onClick={handleClaim}
                className="bg-green-600 hover:bg-green-500 text-white font-black py-6 px-16 rounded-full text-2xl shadow-xl animate-bounce"
             >
                CLAIM REWARD
             </button>
        ) : (
            <div className="text-gray-500 text-lg animate-pulse">Opening...</div>
        )}

      </div>
    </div>
  );
};

export default LuckyBlockOpener;
