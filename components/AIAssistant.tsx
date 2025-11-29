
import React, { useState } from 'react';
import { Tablet } from '../types';

interface AIAssistantProps {
  ownedTablets: Tablet[];
  money: number;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ ownedTablets, money }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Group tablets by type to show counts
  const tabletCounts = ownedTablets.reduce((acc, tablet) => {
    if (!acc[tablet.name]) {
        acc[tablet.name] = 0;
    }
    acc[tablet.name]++;
    return acc;
  }, {} as Record<string, number>);

  const bestTablet = ownedTablets.length > 0 
    ? [...ownedTablets].sort((a, b) => (b.baseIncome * (b.mutationMultiplier || 1)) - (a.baseIncome * (a.mutationMultiplier || 1)))[0]
    : null;

  return (
    <div className="fixed bottom-36 right-4 z-40 flex flex-col items-end pointer-events-auto">
        {isOpen && (
            <div className="bg-slate-900/90 border border-cyan-500 p-4 rounded-xl mb-2 w-64 text-sm shadow-[0_0_20px_cyan] animate-in slide-in-from-right">
                <div className="text-cyan-400 font-bold border-b border-cyan-800 pb-1 mb-2 flex justify-between">
                    <span>AI ASSISTANT v1.0</span>
                    <button onClick={() => setIsOpen(false)} className="text-white">x</button>
                </div>
                <div className="space-y-2 text-gray-300">
                    <p>Total Tablets: <span className="text-white font-bold">{ownedTablets.length}</span></p>
                    <p>Best Item: <span className="text-yellow-400 font-bold">{bestTablet ? bestTablet.name : 'None'}</span></p>
                    {bestTablet && (
                        <p className="text-xs text-gray-500">Generating: ${(bestTablet.baseIncome * (bestTablet.mutationMultiplier || 1)).toLocaleString()}/s</p>
                    )}
                    <div className="max-h-32 overflow-y-auto mt-2 border-t border-gray-700 pt-2">
                        {Object.entries(tabletCounts).map(([name, count]) => (
                            <div key={name} className="flex justify-between text-xs">
                                <span className="truncate w-40">{name}</span>
                                <span className="font-bold">x{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
        
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-lg hover:bg-cyan-500 transition-transform hover:scale-110 relative"
        >
            <span className="text-2xl">🤖</span>
            {!isOpen && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}
        </button>
    </div>
  );
};

export default AIAssistant;
