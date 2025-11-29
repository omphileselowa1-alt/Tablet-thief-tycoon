
import React from 'react';
import { LUCKY_BLOCK_TIERS } from '../constants';

interface LuckyBlockShopProps {
  money: number;
  onBuyLuckyBlock: (type: string, cost: number) => void;
  onBuyLuckyBlockBulk: (count: number, cost: number) => void;
  onClose: () => void;
}

const LuckyBlockShop: React.FC<LuckyBlockShopProps> = ({ 
    money, 
    onBuyLuckyBlock, 
    onBuyLuckyBlockBulk, 
    onClose 
}) => {
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-slate-900 border-4 border-purple-500 rounded-3xl w-full max-w-5xl flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.4)] overflow-hidden max-h-[90vh]">
        
        <div className="bg-purple-900/50 p-6 text-center border-b-4 border-purple-700 relative backdrop-blur-sm">
            <h2 className="text-4xl font-black text-white italic tracking-widest uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                🎰 MYSTIC BLOCK SHOP 🎰
            </h2>
            <p className="text-purple-200 text-xs font-mono mt-1">Test your fate. Risk it all.</p>
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 bg-black/50 hover:bg-black text-white w-10 h-10 rounded-full font-bold border-2 border-purple-500/50"
            >
                X
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-black">
            
            {/* BULK DEALS */}
            <div className="mb-8 bg-gradient-to-r from-yellow-900/20 via-purple-900/20 to-yellow-900/20 p-6 rounded-2xl border-2 border-yellow-500/50">
                <h3 className="text-center text-yellow-400 font-black text-2xl uppercase mb-6 tracking-[0.2em] shadow-black drop-shadow-md">
                    ⚡ FLASH DEALS (BULK) ⚡
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                    onClick={() => onBuyLuckyBlockBulk(3, 7221)}
                    disabled={money < 7221}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 group ${
                        money >= 7221 ? 'bg-slate-800 border-yellow-500 hover:bg-yellow-900/30' : 'bg-slate-900 border-gray-700 opacity-50 cursor-not-allowed'
                    }`}
                    >
                        <div className="text-4xl group-hover:animate-bounce">📦 x3</div>
                        <div className="font-black text-white text-xl">TRIPLE THREAT</div>
                        <div className="text-green-400 font-mono font-bold">$7,221</div>
                    </button>

                    <button
                    onClick={() => onBuyLuckyBlockBulk(20, 25000)}
                    disabled={money < 25000}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 group ${
                        money >= 25000 ? 'bg-slate-800 border-yellow-500 hover:bg-yellow-900/30' : 'bg-slate-900 border-gray-700 opacity-50 cursor-not-allowed'
                    }`}
                    >
                        <div className="text-4xl group-hover:animate-bounce">📦 x20</div>
                        <div className="font-black text-white text-xl">MEGA BUNDLE</div>
                        <div className="text-green-400 font-mono font-bold">$25,000</div>
                    </button>

                    <button
                    onClick={() => onBuyLuckyBlockBulk(50, 121000)}
                    disabled={money < 121000}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 group ${
                        money >= 121000 ? 'bg-slate-800 border-yellow-500 hover:bg-yellow-900/30' : 'bg-slate-900 border-gray-700 opacity-50 cursor-not-allowed'
                    }`}
                    >
                        <div className="text-4xl group-hover:animate-bounce">📦 x50</div>
                        <div className="font-black text-white text-xl">WHALE STACK</div>
                        <div className="text-green-400 font-mono font-bold">$121,000</div>
                    </button>
                </div>
            </div>

            {/* SINGLE BLOCKS */}
            <h3 className="text-center text-purple-300 font-bold text-lg uppercase mb-4 tracking-wider">Single Blocks</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {LUCKY_BLOCK_TIERS.map(tier => (
                    <div 
                    key={tier.id} 
                    className="relative group rounded-xl border-2 overflow-hidden bg-slate-800 flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl"
                    style={{ borderColor: tier.color }}
                    >
                        <div className="p-4 flex justify-center items-center h-32 bg-black/20 group-hover:bg-white/5 transition-colors">
                            <span className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">📦</span>
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col justify-between bg-slate-900/90">
                            <div>
                                <h4 className="font-black uppercase text-sm mb-1" style={{ color: tier.color }}>{tier.name}</h4>
                                <p className="text-[10px] text-gray-400 leading-tight mb-3">{tier.description}</p>
                            </div>
                            <button
                                onClick={() => onBuyLuckyBlock(tier.id, tier.price)}
                                disabled={money < tier.price}
                                className={`w-full py-2 rounded font-bold text-xs uppercase tracking-wider transition-all ${
                                    money >= tier.price 
                                    ? 'hover:brightness-110 active:scale-95' 
                                    : 'bg-slate-800 text-gray-600 cursor-not-allowed border border-slate-700'
                                }`}
                                style={{ 
                                    backgroundColor: money >= tier.price ? tier.color : undefined,
                                    color: money >= tier.price ? (tier.id === 'og' || tier.id === 'common' ? 'black' : 'white') : undefined
                                }}
                            >
                                {money >= tier.price ? `$${tier.price.toLocaleString()}` : 'LOCKED'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
      </div>
    </div>
  );
};

export default LuckyBlockShop;
