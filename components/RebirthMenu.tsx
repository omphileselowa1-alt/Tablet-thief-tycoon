import React from 'react';
import { REBIRTH_TIERS } from '../constants';

interface RebirthMenuProps {
  currentRebirths: number;
  money: number;
  onRebirth: () => void;
  onClose: () => void;
}

const RebirthMenu: React.FC<RebirthMenuProps> = ({ currentRebirths, money, onRebirth, onClose }) => {
  // Next tier is current + 1
  const nextTierIndex = currentRebirths; // since level starts at 1, and array index at 0. But logic: currentRebirths = 0 -> next is level 1 (index 0).
  const nextTier = REBIRTH_TIERS[nextTierIndex];
  
  const isMaxed = currentRebirths >= REBIRTH_TIERS.length;
  const canAfford = nextTier && money >= nextTier.cost;

  // Calculate current multiplier
  const currentMult = currentRebirths > 0 ? REBIRTH_TIERS[currentRebirths - 1].multiplier : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in zoom-in duration-300">
      <div className="bg-slate-900 border-4 border-rose-600 rounded-3xl w-full max-w-lg flex flex-col shadow-[0_0_50px_rgba(225,29,72,0.5)] overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-rose-900 p-6 text-center border-b-4 border-rose-700">
            <h2 className="text-4xl font-black text-white italic tracking-widest uppercase">REBIRTH</h2>
            <p className="text-rose-200 text-xs font-mono">Reset your progress to gain permanent power.</p>
        </div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-rose-200 text-xl font-bold">X</button>

        <div className="p-8 space-y-8 flex-1 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            
            {/* Stats Comparison */}
            <div className="flex justify-between w-full gap-4">
                <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-gray-400 text-xs uppercase font-bold">Current</div>
                    <div className="text-3xl font-black text-white">{currentRebirths}</div>
                    <div className="text-blue-400 font-mono text-sm">x{currentMult} Multiplier</div>
                </div>
                
                <div className="flex items-center text-rose-500 text-2xl font-bold">➜</div>

                <div className="flex-1 bg-rose-900/20 p-4 rounded-xl border border-rose-500 text-center">
                    <div className="text-rose-400 text-xs uppercase font-bold">Next Level</div>
                    <div className="text-3xl font-black text-white">{isMaxed ? 'MAX' : currentRebirths + 1}</div>
                    <div className="text-green-400 font-mono text-sm">
                        {isMaxed ? 'MAXED' : `x${nextTier.multiplier} Multiplier`}
                    </div>
                </div>
            </div>

            {/* Warning Text */}
            <div className="bg-red-950/50 p-4 rounded-lg border border-red-800 text-red-200 text-xs text-center">
                <span className="font-bold text-red-500 block text-lg mb-1">WARNING</span>
                You will lose ALL Money, Tablets, Weapons, and Upgrades. Only your Rebirth Count and Permanent Multiplier remain.
            </div>

            {/* Cost and Action */}
            {!isMaxed ? (
                <div className="w-full">
                     <div className="flex justify-between items-end mb-2 px-2">
                        <span className="text-gray-400 text-sm font-bold">COST:</span>
                        <span className={`text-2xl font-mono font-black ${canAfford ? 'text-green-400' : 'text-red-500'}`}>
                            ${nextTier.cost.toLocaleString()}
                        </span>
                     </div>
                     <button
                        onClick={onRebirth}
                        disabled={!canAfford}
                        className={`w-full py-4 rounded-xl font-black text-2xl uppercase tracking-widest transition-all
                            ${canAfford 
                                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_30px_rgba(225,29,72,0.8)] animate-pulse' 
                                : 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700'}
                        `}
                     >
                        {canAfford ? 'REBIRTH NOW' : 'INSUFFICIENT FUNDS'}
                     </button>
                </div>
            ) : (
                <div className="text-center">
                    <div className="text-3xl font-black text-yellow-400 mb-2">MAXIMUM POWER REACHED</div>
                    <p className="text-gray-400 text-sm">You have ascended beyond standard limits.</p>
                </div>
            )}

        </div>

      </div>
    </div>
  );
};

export default RebirthMenu;