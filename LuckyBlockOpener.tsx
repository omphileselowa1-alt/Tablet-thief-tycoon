import React, { useState, useEffect } from 'react';
import { Tablet } from '../types';
import { TABLETS, getRarityColor } from '../constants';

interface LuckyBlockOpenerProps {
  onComplete: (reward: Tablet) => void;
  onClose: () => void;
}

const LuckyBlockOpener: React.FC<LuckyBlockOpenerProps> = ({ onComplete, onClose }) => {
  const [stage, setStage] = useState<'shaking' | 'rolling' | 'revealed'>('shaking');
  const [displayItem, setDisplayItem] = useState<string>("?");
  const [finalItem, setFinalItem] = useState<Tablet | null>(null);

  // Animation Refs
  const rollInterval = React.useRef<any>(null);

  useEffect(() => {
    // 1. Shake Phase (simulated by CSS)
    const shakeTimer = setTimeout(() => {
        setStage('rolling');
        startRolling();
    }, 2000);

    return () => clearTimeout(shakeTimer);
  }, []);

  const startRolling = () => {
    // 2. Roll Phase - Cycle names rapidly
    let count = 0;
    const items = [
        "The Horrible", "The Good Tablet", "The Hotspot", 
        "La Secret Combination", "La OG Combination", "Galaxy Block",
        "???"
    ];

    rollInterval.current = setInterval(() => {
        setDisplayItem(items[count % items.length]);
        count++;
    }, 100);

    // Stop rolling after 3 seconds and determine winner
    setTimeout(() => {
        clearInterval(rollInterval.current);
        determineWinner();
    }, 3000);
  };

  const determineWinner = () => {
    // 3. Logic:
    // 0.01% -> La OG (la_og)
    // 0.5% -> La Secret (la_secret)
    // 1% -> Hotspot (hotspot)
    // 5% -> Good Tablet (good_tablet)
    // 80% (Rest) -> Horrible (horrible)

    const roll = Math.random() * 100;
    let winnerId = 'horrible';

    if (roll <= 0.01) winnerId = 'la_og';
    else if (roll <= 0.51) winnerId = 'la_secret';
    else if (roll <= 1.51) winnerId = 'hotspot';
    else if (roll <= 6.51) winnerId = 'good_tablet';
    else winnerId = 'horrible'; // ~93.5% technically to fill gap, prompt said 80%

    const winner = TABLETS.find(t => t.id === winnerId);
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95">
      
      {/* Container */}
      <div className="flex flex-col items-center justify-center w-full max-w-md text-center p-8">
        
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-8 animate-pulse">
            GALAXY BLOCK
        </h2>

        {/* Visual Box */}
        <div className={`
            w-48 h-48 rounded-3xl mb-8 flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(168,85,247,0.5)] border-4 border-purple-500 bg-slate-900 relative
            ${stage === 'shaking' ? 'animate-bounce' : ''}
            ${stage === 'revealed' ? 'animate-none border-white shadow-[0_0_100px_white]' : ''}
        `}>
            {stage === 'revealed' && finalItem ? (
                // Revealed Visual
                <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-2xl animate-in zoom-in duration-500">
                     <div className="absolute inset-0 bg-white animate-ping opacity-50"></div>
                     <span className="relative z-10 text-8xl">📱</span>
                     <div className="absolute bottom-2 text-xs font-black uppercase bg-black/50 px-2 rounded">
                        {finalItem.rarity}
                     </div>
                </div>
            ) : (
                // Mystery Visual
                <div className="text-purple-300 font-black text-8xl">?</div>
            )}
        </div>

        {/* Rolling Text */}
        <div className="h-12 overflow-hidden mb-8">
            <div className={`text-2xl font-mono font-bold text-white transition-all
                ${stage === 'revealed' ? 'scale-150 text-green-400' : ''}
            `}>
                {stage === 'revealed' ? finalItem?.name : displayItem}
            </div>
        </div>

        {stage === 'revealed' ? (
             <button 
                onClick={handleClaim}
                className="bg-green-600 hover:bg-green-500 text-white font-black py-4 px-12 rounded-full text-xl shadow-xl animate-bounce"
             >
                CLAIM REWARD
             </button>
        ) : (
            <div className="text-gray-500 text-sm animate-pulse">Opening...</div>
        )}

      </div>
    </div>
  );
};

export default LuckyBlockOpener;
