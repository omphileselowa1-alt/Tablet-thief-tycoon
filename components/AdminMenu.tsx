
import React, { useState } from 'react';
import { TABLETS, EVENTS, getRarityColor } from '../constants';
import { Tablet } from '../types';

interface AdminMenuProps {
  onTriggerEvent: (eventName: string) => void;
  onTriggerAllEvents: () => void;
  onSpawnTablet: (tablet: Tablet) => void;
  
  luckLevel: number;
  setLuckLevel: (level: number) => void;

  luckyBlockLuck: number;
  setLuckyBlockLuck: (level: number) => void;

  eventDuration: number;
  setEventDuration: (min: number) => void;

  // Player Profile
  playerName: string;
  setPlayerName: (name: string) => void;
  playerColor: string;
  setPlayerColor: (color: string) => void;
  globalMultiplier: number;
  setGlobalMultiplier: (mult: number) => void;

  // New Features
  serverMessage: string | null;
  setServerMessage: (msg: string | null) => void;
  disabledEvents: string[];
  toggleEventDisabled: (eventName: string) => void;

  // Traits
  traitMultiplier: number;
  setTraitMultiplier: (val: number) => void;

  onClose: () => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ 
    onTriggerEvent, 
    onTriggerAllEvents,
    onSpawnTablet, 
    luckLevel,
    setLuckLevel,
    luckyBlockLuck,
    setLuckyBlockLuck,
    eventDuration,
    setEventDuration,
    playerName,
    setPlayerName,
    playerColor,
    setPlayerColor,
    globalMultiplier,
    setGlobalMultiplier,
    serverMessage,
    setServerMessage,
    disabledEvents,
    toggleEventDisabled,
    traitMultiplier,
    setTraitMultiplier,
    onClose 
}) => {
  const [tab, setTab] = useState<'events' | 'spawn' | 'machine' | 'player' | 'cheat' | 'traits'>('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [msgInput, setMsgInput] = useState('');

  const handleSendMessage = () => {
      setServerMessage(msgInput);
  };

  const handleClearMessage = () => {
      setServerMessage(null);
      setMsgInput('');
  };

  // Filter for machine tablets
  const machineTablets = TABLETS.filter(t => t.id.startsWith('machine_mk'));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
      
      {/* Rainbow Border Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl p-[4px] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.2)]">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)] animate-[spin_4s_linear_infinite]"></div>
        
        <div className="relative bg-slate-950 rounded-[20px] w-full h-full flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                  <h2 className="text-3xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-pulse">
                      ADMIN OVERLORD
                  </h2>
                  <p className="text-[10px] text-gray-400 font-mono">v9.9.9 // ACCESS GRANTED</p>
              </div>
              <button 
                onClick={onClose} 
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg shadow-[0_0_15px_red]"
              >
                CLOSE PANEL
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-black/40 overflow-x-auto">
              {['events', 'player', 'cheat', 'traits', 'spawn', 'machine'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setTab(t as any)}
                    className={`flex-1 py-4 font-black uppercase transition-all text-xs sm:text-sm tracking-widest
                        ${tab === t 
                            ? 'bg-white text-black shadow-[0_0_20px_white] z-10 scale-105' 
                            : 'text-gray-500 hover:text-white hover:bg-white/10'
                        }
                    `}
                  >
                    {t}
                  </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              
              {/* --- TRAITS TAB (NEW) --- */}
              {tab === 'traits' && (
                  <div className="space-y-6">
                      <div className="bg-purple-900/20 border border-purple-500 p-6 rounded-2xl">
                          <h3 className="text-purple-400 font-black text-xl mb-2">DNA MANIPULATION</h3>
                          <p className="text-gray-400 text-xs mb-4">Modify the genetic structure of the game economy. Traits act as a global multiplier separate from standard multipliers.</p>
                          
                          <label className="text-xs font-bold uppercase block mb-2 text-white">Trait Strength Multiplier</label>
                          <div className="flex gap-4 items-center">
                              <input 
                                  type="range"
                                  min="1"
                                  max="1000"
                                  step="1"
                                  value={traitMultiplier}
                                  onChange={(e) => setTraitMultiplier(parseFloat(e.target.value))}
                                  className="flex-1 accent-purple-500 h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                              />
                              <input 
                                  type="number"
                                  value={traitMultiplier}
                                  onChange={(e) => setTraitMultiplier(parseFloat(e.target.value))}
                                  className="w-24 bg-black border border-purple-500 rounded p-2 text-white font-mono font-bold"
                              />
                          </div>
                          <div className="mt-4 text-center text-6xl font-black text-purple-500 animate-pulse">
                              x{traitMultiplier.toLocaleString()}
                          </div>
                      </div>
                  </div>
              )}

              {/* --- PLAYER TAB --- */}
              {tab === 'player' && (
                 <div className="space-y-6">
                     <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                        <label className="text-xs text-blue-400 font-bold uppercase block mb-2">Broadcast Server Message</label>
                        <div className="flex gap-2 mb-2">
                            <input 
                                type="text" 
                                value={msgInput}
                                onChange={(e) => setMsgInput(e.target.value)}
                                className="w-full bg-black border border-slate-700 p-3 rounded-lg text-white focus:border-blue-500 outline-none"
                                placeholder="Type message here..."
                            />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleSendMessage} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg">
                                SEND ANNOUNCEMENT
                            </button>
                            <button onClick={handleClearMessage} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg">
                                CLEAR
                            </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10">
                            <label className="text-xs text-purple-400 font-bold uppercase block mb-2">Display Name</label>
                            <input 
                               type="text" 
                               value={playerName}
                               onChange={(e) => setPlayerName(e.target.value)}
                               className="w-full bg-black border border-slate-700 p-3 rounded-lg text-white"
                            />
                         </div>

                         <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10">
                            <label className="text-xs text-pink-400 font-bold uppercase block mb-2">Avatar Color</label>
                            <div className="flex gap-2 items-center">
                                <input 
                                   type="color" 
                                   value={playerColor}
                                   onChange={(e) => setPlayerColor(e.target.value)}
                                   className="w-full h-10 bg-transparent border-none cursor-pointer rounded-lg"
                                />
                            </div>
                         </div>
                     </div>
                 </div>
              )}

              {tab === 'cheat' && (
                 <div className="space-y-6">
                     <div className="bg-slate-900/80 p-6 rounded-2xl border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                         <label className="text-xs text-green-400 font-bold uppercase block mb-2">Global Luck Multiplier</label>
                         <div className="grid grid-cols-4 gap-2">
                             {[1, 2, 10, 999].map((val) => (
                                 <button
                                    key={val}
                                    onClick={() => setLuckLevel(val)}
                                    className={`py-3 rounded-lg font-bold text-sm transition-all ${luckLevel === val ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
                                 >
                                     {val >= 999 ? 'MAX' : `${val}x`}
                                 </button>
                             ))}
                         </div>
                     </div>

                     <div className="bg-slate-900/80 p-6 rounded-2xl border border-yellow-500/30">
                         <label className="text-xs text-yellow-400 font-bold uppercase block mb-2">Galaxy Block Luck (10x Mode)</label>
                         <button
                            onClick={() => setLuckyBlockLuck(luckyBlockLuck === 10 ? 1 : 10)}
                            className={`w-full py-4 rounded-xl font-black uppercase text-xl border-2 transition-all ${luckyBlockLuck === 10 ? 'bg-yellow-500 border-yellow-300 text-black animate-pulse shadow-[0_0_30px_rgba(234,179,8,0.5)]' : 'bg-slate-800 border-slate-600 text-gray-400'}`}
                         >
                             {luckyBlockLuck === 10 ? 'ACTIVE (10x LUCK)' : 'NORMAL (1x LUCK)'}
                         </button>
                     </div>

                     <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-500/30">
                        <label className="text-xs text-blue-400 font-bold uppercase block mb-2">Custom Money Multiplier</label>
                        <div className="flex gap-2">
                            <input 
                               type="number" 
                               value={globalMultiplier}
                               onChange={(e) => setGlobalMultiplier(Math.max(1, parseFloat(e.target.value)))}
                               className="flex-1 bg-black border border-slate-700 p-3 rounded-lg text-white font-mono"
                            />
                            <button 
                               onClick={() => setGlobalMultiplier(globalMultiplier * 10)}
                               className="bg-blue-600 text-white font-bold px-6 rounded-lg hover:bg-blue-500"
                            >
                               x10
                            </button>
                        </div>
                     </div>
                 </div>
              )}

              {tab === 'events' && (
                <div className="space-y-6">
                  
                  <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10">
                    <div className="text-xs text-gray-400 font-bold uppercase mb-2">
                        Event Duration (Minutes)
                    </div>
                    <div className="flex items-center gap-4">
                        <input 
                            type="range" 
                            min="0.1" 
                            max="10" 
                            step="0.1"
                            value={eventDuration}
                            onChange={(e) => setEventDuration(parseFloat(e.target.value))}
                            className="flex-1 accent-white h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="font-mono font-bold text-white w-12">{eventDuration}m</span>
                    </div>
                  </div>

                  <button
                     onClick={() => {
                         onTriggerAllEvents();
                         onClose();
                     }}
                     className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 border-b-8 border-red-900 text-center p-8 rounded-2xl font-black text-white uppercase text-4xl tracking-widest animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.8)] flex flex-col items-center justify-center transform active:scale-95 transition-transform"
                  >
                      <span className="text-8xl mb-4 animate-bounce">👋</span>
                      <span>ADMIN ABUSE</span>
                      <span className="text-sm opacity-70 mt-2 font-mono">SLAP THE SERVER (TRIGGER ALL)</span>
                  </button>

                  <h3 className="text-xs text-gray-400 font-bold uppercase mb-2">Toggle Specific Events</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EVENTS.map((evt) => {
                        const isDisabled = disabledEvents.includes(evt.name);
                        return (
                            <div key={evt.name} className="flex gap-2">
                                <button
                                    onClick={() => toggleEventDisabled(evt.name)}
                                    className={`w-12 flex items-center justify-center font-bold text-lg rounded-lg border-2 ${isDisabled ? 'bg-red-900/50 border-red-600 text-red-300' : 'bg-green-900/50 border-green-600 text-green-300'}`}
                                >
                                    {isDisabled ? 'OFF' : 'ON'}
                                </button>
                                <button
                                    onClick={() => !isDisabled && onTriggerEvent(evt.name)}
                                    disabled={isDisabled}
                                    className={`flex-1 text-left p-3 rounded-lg border-2 transition-all flex justify-between items-center
                                        ${isDisabled 
                                            ? 'bg-slate-900 border-slate-800 text-gray-600 cursor-not-allowed' 
                                            : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-white text-white'
                                        }
                                    `}
                                >
                                    <div className={isDisabled ? "" : "font-bold text-yellow-400"}>{evt.name}</div>
                                    {!isDisabled && <div className="text-[10px] text-gray-500">Trigger</div>}
                                </button>
                            </div>
                        );
                    })}
                  </div>
                </div>
              )}

              {tab === 'spawn' && (
                <div className="space-y-4">
                  <input 
                      type="text"
                      placeholder="Search Tablet Name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl p-4 text-white mb-4 focus:border-blue-500 outline-none"
                  />

                  {/* ROYALTY OF OG, OP & LIMITED GROUP */}
                  <div className="bg-slate-900/90 p-6 rounded-2xl border-2 border-yellow-500/50 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                      <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 font-black text-center mb-4 tracking-[0.5em] text-lg animate-pulse">
                          👑 ROYALTY OF OG, OP & LIMITED 👑
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {/* OP Collection */}
                        <button
                            onClick={() => {
                            const item = TABLETS.find(t => t.id === 'op_combo');
                            if (item) onSpawnTablet(item);
                            }}
                            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black p-4 rounded-xl shadow-lg border-2 border-fuchsia-400 animate-pulse text-xl"
                        >
                            THE OP COLLECTION
                        </button>
                        
                         {/* OGs */}
                         <div className="grid grid-cols-2 gap-2">
                            {TABLETS.filter(t => t.rarity === 'OG').map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => onSpawnTablet(t)}
                                    className="bg-white text-black font-black p-3 rounded-lg hover:bg-gray-200 border-2 border-gray-400"
                                >
                                    {t.name}
                                </button>
                            ))}
                         </div>
                        
                        <div className="h-px bg-white/20 my-2"></div>
                        
                        {/* OP Items */}
                        <div className="grid grid-cols-3 gap-2">
                            {TABLETS.filter(t => t.rarity === 'OP' && t.id !== 'op_combo').map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => onSpawnTablet(t)}
                                    className="bg-fuchsia-900/50 hover:bg-fuchsia-800 text-fuchsia-200 text-xs font-bold p-2 rounded border border-fuchsia-600 truncate"
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>

                        <div className="h-px bg-white/20 my-2"></div>

                        {/* LIMITED Items */}
                        <div className="text-orange-400 font-bold text-center mb-2 text-xs tracking-widest">LIMITED SERIES (67)</div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                            {TABLETS.filter(t => t.rarity === 'Limited').map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => onSpawnTablet(t)}
                                    className="bg-orange-900/40 hover:bg-orange-600 text-orange-200 text-[9px] font-bold p-1 rounded border border-orange-700/50 truncate"
                                    title={t.name}
                                >
                                    #{t.id.split('_')[1]} {t.name}
                                </button>
                            ))}
                        </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TABLETS.filter(t => 
                        !t.id.startsWith('machine_mk') && 
                        t.rarity !== 'OG' && 
                        t.rarity !== 'OP' && 
                        t.rarity !== 'Limited' &&
                        t.rarity !== 'Secret' && 
                        t.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((t) => (
                        <button
                            key={t.id}
                            onClick={() => onSpawnTablet(t)}
                            className="bg-slate-800 hover:bg-slate-700 text-blue-200 text-xs font-bold p-3 rounded-lg border border-slate-600 truncate flex items-center gap-2 transition-all hover:scale-105"
                            title={t.name}
                        >
                            <span>{t.icon}</span>
                            <span className="truncate">{t.name}</span>
                        </button>
                    ))}
                  </div>
                </div>
              )}

              {/* --- MACHINE TAB (NEW) --- */}
              {tab === 'machine' && (
                  <div className="space-y-4">
                      <div className="bg-cyan-900/20 border border-cyan-500 p-4 rounded-xl text-center mb-4">
                          <h3 className="text-cyan-400 font-black text-xl">54 PROTOTYPES</h3>
                          <p className="text-gray-400 text-xs">Spawn specific machine outputs directly.</p>
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {machineTablets.map(t => (
                              <button
                                  key={t.id}
                                  onClick={() => onSpawnTablet(t)}
                                  className="bg-slate-800 hover:bg-cyan-900 text-cyan-200 text-[10px] font-bold p-2 rounded border border-slate-700 hover:border-cyan-500 transition-all flex flex-col items-center gap-1"
                              >
                                  <div className="text-lg">{t.icon}</div>
                                  <div className="truncate w-full text-center">{t.name.replace("Machine Prototype ", "")}</div>
                                  <div className="text-[8px] px-1 rounded bg-black" style={{ color: getRarityColor(t.rarity) }}>
                                      {t.rarity}
                                  </div>
                              </button>
                          ))}
                      </div>
                  </div>
              )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
