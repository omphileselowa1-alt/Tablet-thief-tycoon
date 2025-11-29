import React from 'react';
import { Tablet } from '../types';
import { getRarityColor } from '../constants';

interface LootPopupProps {
  data: { tablet: Tablet; source: string };
  ownedTablets?: Tablet[];
  onClose: () => void;
}

const LootPopup: React.FC<LootPopupProps> = ({ data, ownedTablets, onClose }) => {
  const { tablet, source } = data;
  const isSpecial = tablet.mutation && tablet.mutation !== "Standard";
  const rarityColor = getRarityColor(tablet.rarity);
  
  // Calculate count of owned tablets with same name
  const ownedCount = ownedTablets ? ownedTablets.filter(t => t.name === tablet.name).length : 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border-2 border-slate-600 rounded-2xl w-80 p-6 flex flex-col items-center shadow-2xl scale-in-center overflow-hidden">
        
        {/* Animated Glow BG */}
        <div 
            className="absolute inset-0 opacity-20"
            style={{ 
                background: `radial-gradient(circle, ${rarityColor} 0%, transparent 70%)` 
            }}
        ></div>

        {/* Close Button X */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-500 rounded-full text-white font-bold shadow-lg z-10"
        >
          X
        </button>

        <div className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4 z-10 text-center">
            {source}
        </div>
        
        {/* Icon / Visual */}
        <div className={`w-24 h-24 rounded-xl mb-4 flex items-center justify-center text-6xl shadow-inner z-10 relative
            ${isSpecial ? 'animate-pulse' : ''}
        `}
        style={{
             backgroundColor: `${rarityColor}20`,
             border: `2px solid ${rarityColor}`
        }}
        >
          {tablet.icon || '📱'}
        </div>

        {/* Rarity Label */}
        <div 
            className="text-xs font-black uppercase px-2 py-1 rounded mb-1 z-10"
            style={{ backgroundColor: rarityColor, color: tablet.rarity === 'OG' || tablet.rarity === 'Common' ? 'black' : 'white' }}
        >
            {tablet.rarity}
        </div>

        {/* Mutation Label */}
        {tablet.mutation && (
          <div 
            className="text-lg font-black uppercase tracking-wider mb-1 z-10"
            style={{ 
                color: isSpecial ? '#a855f7' : '#94a3b8',
                textShadow: isSpecial ? '0 0 10px rgba(168,85,247,0.5)' : 'none'
            }}
          >
            {tablet.mutation}
          </div>
        )}

        {/* Name */}
        <div className="text-2xl font-bold text-white text-center leading-none mb-2 z-10">
          {tablet.name}
        </div>

        {/* Stats */}
        <div className="bg-slate-800/80 rounded-lg p-3 w-full mt-2 z-10 backdrop-blur-sm border border-slate-700">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2">
            <span className="text-gray-400 text-xs">VALUE</span>
            <span className="text-green-400 font-mono font-bold">${tablet.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">INCOME</span>
            <span className="text-blue-400 font-mono font-bold">+{tablet.baseIncome}/s</span>
          </div>
          {isSpecial && tablet.mutationMultiplier && (
             <div className="text-center text-xs text-purple-400 mt-2 font-bold">
               MULTIPLIER: x{tablet.mutationMultiplier}
             </div>
          )}
          {ownedCount > 0 && (
             <div className="text-center text-xs text-yellow-500 mt-2 font-black uppercase tracking-wider">
               OWNED: {ownedCount}
             </div>
          )}
        </div>

        <button 
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg z-10"
        >
            COLLECT
        </button>
      </div>
    </div>
  );
};

export default LootPopup;