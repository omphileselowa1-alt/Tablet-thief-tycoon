
import React from 'react';
import { Tablet } from '../types';
import { TABLETS, getRarityColor } from '../constants';

interface TabletMachineProps {
  money: number;
  onBuy: (tablet: Tablet, cost: number) => void;
  onClose: () => void;
}

const TabletMachine: React.FC<TabletMachineProps> = ({ money, onBuy, onClose }) => {
  // Filter for the generated "Machine Prototype" tablets
  const machineTablets = TABLETS.filter(t => t.id.startsWith('machine_mk'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in zoom-in duration-300">
      <div className="bg-slate-900 border-4 border-cyan-500 rounded-3xl w-full max-w-6xl flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.5)] overflow-hidden h-[90vh]">
        
        <div className="bg-cyan-900 p-6 text-center border-b-4 border-cyan-700 relative">
            <h2 className="text-4xl font-black text-white italic tracking-widest uppercase">TABLET MACHINE 5000</h2>
            <p className="text-cyan-200 text-xs font-mono">Create the 54 Secret Prototypes.</p>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full font-bold"
            >
                X
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {machineTablets.map((tablet) => {
                    const color = getRarityColor(tablet.rarity);
                    const canAfford = money >= tablet.price;
                    
                    return (
                        <div key={tablet.id} className="bg-slate-800 border-2 border-slate-700 rounded-xl p-4 flex flex-col items-center hover:border-cyan-400 transition-all group">
                             <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                 {tablet.icon}
                             </div>
                             <div className="font-bold text-white text-center text-sm mb-1">{tablet.name}</div>
                             <div 
                                className="text-[10px] uppercase font-black px-2 py-0.5 rounded text-black mb-2"
                                style={{ backgroundColor: color }}
                             >
                                 {tablet.rarity}
                             </div>
                             <div className="text-gray-400 text-[10px] text-center mb-4 min-h-[30px]">{tablet.description}</div>
                             
                             <button
                                onClick={() => onBuy(tablet, tablet.price)}
                                disabled={!canAfford}
                                className={`w-full py-2 rounded font-bold text-xs uppercase ${
                                    canAfford 
                                    ? 'bg-green-600 hover:bg-green-500 text-white' 
                                    : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                                }`}
                             >
                                 ${tablet.price.toLocaleString()}
                             </button>
                        </div>
                    );
                })}
            </div>
        </div>

      </div>
    </div>
  );
};

export default TabletMachine;
