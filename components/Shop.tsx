
import React, { useState } from 'react';
import { Tablet, Weapon } from '../types';
import { TABLETS, WEAPONS, GAME_PASSES, STARTER_PACKS } from '../constants';

interface ShopProps {
  money: number;
  onBuyTablet: (tablet: Tablet) => void;
  onBuyWeapon: (weapon: Weapon) => void;
  onBuyStorage: () => void;
  maxStorage: number;
  
  onBuyPass: (passId: string) => void;
  ownedPasses: string[];
  
  onBuyStarterPack: (packId: string) => void;

  ownedWeapons: Weapon[];
  onClose: () => void;
}

const Shop: React.FC<ShopProps> = ({ 
    money, 
    onBuyTablet, 
    onBuyWeapon, 
    onBuyStorage, 
    maxStorage, 
    onBuyPass,
    ownedPasses,
    onBuyStarterPack,
    ownedWeapons, 
    onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'tablets' | 'weapons' | 'passes' | 'starter'>('tablets');

  const hasWeapon = (id: string) => ownedWeapons.some(w => w.id === id);
  
  // Storage Cost
  const currentUpgrades = (maxStorage - 60) / 10;
  const storageCost = 500 + (currentUpgrades * 500);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-600 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800 rounded-t-xl">
          <h2 className="text-2xl font-bold text-white">Dark Web Market</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 overflow-x-auto">
          <button
            className={`flex-1 min-w-[80px] py-3 text-center font-semibold transition-colors text-xs sm:text-sm ${activeTab === 'starter' ? 'bg-slate-700 text-green-400' : 'text-gray-400 hover:bg-slate-800'}`}
            onClick={() => setActiveTab('starter')}
          >
            Packs
          </button>
          <button
            className={`flex-1 min-w-[80px] py-3 text-center font-semibold transition-colors text-xs sm:text-sm ${activeTab === 'tablets' ? 'bg-slate-700 text-blue-400' : 'text-gray-400 hover:bg-slate-800'}`}
            onClick={() => setActiveTab('tablets')}
          >
            Tablets
          </button>
          <button
            className={`flex-1 min-w-[80px] py-3 text-center font-semibold transition-colors text-xs sm:text-sm ${activeTab === 'weapons' ? 'bg-slate-700 text-red-400' : 'text-gray-400 hover:bg-slate-800'}`}
            onClick={() => setActiveTab('weapons')}
          >
            Upgrades
          </button>
           <button
            className={`flex-1 min-w-[80px] py-3 text-center font-semibold transition-colors text-xs sm:text-sm ${activeTab === 'passes' ? 'bg-slate-700 text-yellow-400' : 'text-gray-400 hover:bg-slate-800'}`}
            onClick={() => setActiveTab('passes')}
          >
            Passes
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {activeTab === 'starter' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {STARTER_PACKS.map(pack => (
                      <div key={pack.id} className="bg-gradient-to-br from-green-900/40 to-slate-800 border-2 border-green-600 rounded-xl p-4 flex flex-col justify-between hover:scale-105 transition-transform">
                          <div>
                              <h3 className="text-xl font-black text-green-300 uppercase italic">{pack.name}</h3>
                              <p className="text-gray-400 text-sm mb-4">{pack.description}</p>
                              <div className="space-y-1 mb-4">
                                  {pack.items.map((item, idx) => {
                                      const t = TABLETS.find(t => t.id === item.tabletId);
                                      const w = WEAPONS.find(w => w.id === item.tabletId);
                                      return (
                                          <div key={idx} className="flex items-center gap-2 text-sm font-bold">
                                              <span>•</span>
                                              <span>{item.count}x</span>
                                              <span className="text-white">{t?.name || w?.name}</span>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                          <button
                            onClick={() => onBuyStarterPack(pack.id)}
                            disabled={money < pack.price}
                            className={`w-full py-2 rounded-lg font-black uppercase ${
                                money >= pack.price ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                              Buy ${pack.price.toLocaleString()}
                          </button>
                      </div>
                  ))}
              </div>
          )}

          {activeTab === 'tablets' && (
            <div className="grid grid-cols-1 gap-4">
              {TABLETS.filter(t => t.rarity !== 'Secret' && t.rarity !== 'OG' && t.rarity !== 'God' && t.rarity !== 'Mythic' && t.price > 0 && t.id !== 'horrible').map((tablet) => (
                <div key={tablet.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-all">
                  <div>
                    <h3 className="text-lg font-bold text-blue-200">{tablet.name}</h3>
                    <p className="text-sm text-gray-400">{tablet.description}</p>
                    <p className="text-xs text-green-400 mt-1">+{tablet.baseIncome} / sec</p>
                  </div>
                  <button
                    onClick={() => onBuyTablet(tablet)}
                    disabled={money < tablet.price}
                    className={`px-4 py-2 rounded font-bold min-w-[100px] ${
                      money >= tablet.price
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    ${tablet.price.toLocaleString()}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'weapons' && (
            <div className="grid grid-cols-1 gap-4">
              
              {/* Storage Upgrade Option */}
              <div className="flex items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-purple-500 transition-all">
                 <div>
                    <h3 className="text-lg font-bold text-purple-200">Backpack Expansion</h3>
                    <p className="text-sm text-gray-400">Increase storage capacity by +10 slots.</p>
                    <p className="text-xs text-purple-400 mt-1">Current Capacity: {maxStorage}</p>
                 </div>
                 <button
                    onClick={onBuyStorage}
                    disabled={money < storageCost}
                    className={`px-4 py-2 rounded font-bold min-w-[100px] ${
                      money >= storageCost
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    ${storageCost.toLocaleString()}
                  </button>
              </div>

              {WEAPONS.map((weapon) => {
                const isRealMoney = typeof weapon.price === 'string';
                const alreadyOwned = hasWeapon(weapon.id);
                const canAfford = !isRealMoney && money >= (weapon.price as number);

                return (
                  <div key={weapon.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-red-500 transition-all">
                    <div>
                      <h3 className="text-lg font-bold text-red-200">{weapon.name}</h3>
                      <p className="text-sm text-gray-400">{weapon.description}</p>
                      <p className="text-xs text-yellow-400 mt-1">x{weapon.robBoost} Rob Speed</p>
                    </div>
                    {alreadyOwned ? (
                       <span className="px-4 py-2 rounded bg-green-900/50 text-green-400 border border-green-800 font-bold min-w-[100px] text-center">
                         Owned
                       </span>
                    ) : (
                      <button
                        onClick={() => !isRealMoney && onBuyWeapon(weapon)}
                        disabled={!canAfford && !isRealMoney}
                        className={`px-4 py-2 rounded font-bold min-w-[100px] ${
                          isRealMoney 
                            ? 'bg-yellow-600/20 text-yellow-500 border border-yellow-600 cursor-not-allowed' 
                            : canAfford
                              ? 'bg-red-600 hover:bg-red-500 text-white'
                              : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                        }`}
                        title={isRealMoney ? "Simulation Only" : "Buy Weapon"}
                      >
                        {isRealMoney ? weapon.price : `$${weapon.price.toLocaleString()}`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'passes' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GAME_PASSES.map((pass) => {
                    const isOwned = ownedPasses.includes(pass.id);
                    const canAfford = money >= pass.price;

                    return (
                        <div key={pass.id} className={`
                             relative p-4 rounded-xl border-2 flex flex-col justify-between overflow-hidden
                             ${isOwned ? 'bg-gradient-to-br from-yellow-900/20 to-black border-yellow-600' : 'bg-slate-800 border-slate-600'}
                        `}>
                            {/* Icon Background */}
                            <div className="absolute top-0 right-0 p-4 text-6xl opacity-10 grayscale-0">
                                {pass.icon}
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{pass.icon}</span>
                                    <h3 className={`text-xl font-black uppercase ${isOwned ? 'text-yellow-400' : 'text-white'}`}>{pass.name}</h3>
                                </div>
                                <p className="text-sm text-gray-300 mb-4">{pass.description}</p>
                            </div>

                            {isOwned ? (
                                <div className="bg-yellow-600 text-black font-bold text-center py-2 rounded-lg uppercase tracking-widest">
                                    Owned
                                </div>
                            ) : (
                                <button
                                    onClick={() => onBuyPass(pass.id)}
                                    disabled={!canAfford}
                                    className={`py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                                        canAfford ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/50' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Buy ${pass.price.toLocaleString()}
                                </button>
                            )}
                        </div>
                    );
                })}
             </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-800 rounded-b-xl border-t border-slate-700 text-center text-gray-400 text-sm">
            Current Balance: <span className="text-white font-mono">${Math.floor(money).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Shop;
