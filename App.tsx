
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameCanvas from './components/GameCanvas';
import Shop from './components/Shop'; 
import TabletIndex from './components/TabletIndex';
import ActionLog from './components/ActionLog';
import LootPopup from './components/LootPopup';
import AdminMenu from './components/AdminMenu';
import FuseMachine from './components/FuseMachine';
import CraftMachine from './components/CraftMachine';
import Trader from './components/Trader'; 
import LuckyBlockOpener from './components/LuckyBlockOpener';
import RedCarpetShowroom from './components/RedCarpetShowroom';
import TabletMachine from './components/TabletMachine'; 
import FingerprintScanner from './components/FaceScanner'; 
import SettingsMenu from './components/SettingsMenu';
import RebirthMenu from './components/RebirthMenu';
import AIAssistant from './components/AIAssistant'; 
import LuckyBlockShop from './components/LuckyBlockShop';
import QuantumTruck from './components/QuantumTruck'; // NEW
import SpinningWheel from './components/SpinningWheel'; // NEW
import { Tablet, Weapon, LogEntry, PlayerState } from './types';
import { TABLETS, WEAPONS, EVENTS, MUTATIONS, GAME_PASSES, STARTER_PACKS, REBIRTH_TIERS, LUCKY_BLOCK_TIERS, SPIN_WHEEL_PRIZES } from './constants';

const App: React.FC = () => {
  // --- STATE ---
  const [money, setMoney] = useState<number>(0);
  const [incomePerSec, setIncomePerSec] = useState<number>(0);
  const [totalMultiplier, setTotalMultiplier] = useState<number>(1);
  
  const [ownedTablets, setOwnedTablets] = useState<Tablet[]>([]);
  const [ownedWeapons, setOwnedWeapons] = useState<Weapon[]>([]);
  const [ownedGamePasses, setOwnedGamePasses] = useState<string[]>([]);
  const [maxStorage, setMaxStorage] = useState<number>(64);
  const [hasFastCharger, setHasFastCharger] = useState(false);
  const [rebirths, setRebirths] = useState<number>(0);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [globalMultiplier, setGlobalMultiplier] = useState<number>(1); 
  const [traitMultiplier, setTraitMultiplier] = useState<number>(1); // From Admin Panel Traits
  
  // Floating Text State
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number, value: string }[]>([]);
  const clickIdRef = useRef(0);

  // Player & Movement
  const [player, setPlayer] = useState<PlayerState>({ 
      x: 0, y: 0, speed: 8, name: "Thief", color: "#3b82f6" 
  });
  const [joystick, setJoystick] = useState({ active: false, originX: 0, originY: 0, currentX: 0, currentY: 0 });
  const [isMoving, setIsMoving] = useState(false);

  // Stealing & Jail State
  const [isStealing, setIsStealing] = useState(false);
  const [isArrested, setIsArrested] = useState(false);
  const [jailTime, setJailTime] = useState(0);

  // UI State
  const [activeModal, setActiveModal] = useState<'shop' | 'index' | 'admin' | 'fuse' | 'craft' | 'trader' | 'lucky' | 'showroom' | 'scanner' | 'settings' | 'rebirth' | 'machine' | 'lucky_shop' | 'quantum_truck' | 'wheel' | null>(null);
  
  // Safe / Face ID State
  const [hasFingerprint, setHasFingerprint] = useState(false); 
  const [scannerMode, setScannerMode] = useState<'enroll' | 'verify'>('verify');
  const [isVaultOpen, setIsVaultOpen] = useState(false); 

  // Loot result
  const [lootResult, setLootResult] = useState<{ tablet: Tablet; source: string } | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");

  // Game Logic State
  const [adminLuckLevel, setAdminLuckLevel] = useState<number>(1); 
  const [luckyBlockLuck, setLuckyBlockLuck] = useState<number>(1); 
  const [activeLuckyBlockType, setActiveLuckyBlockType] = useState<string>('common');

  const [isOwner, setIsOwner] = useState(false); 
  const [chaosMode, setChaosMode] = useState(false);
  const [adminSlapActive, setAdminSlapActive] = useState(false);
  const [eventDurationMinutes, setEventDurationMinutes] = useState(1); 

  // Admin Features
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [disabledEvents, setDisabledEvents] = useState<string[]>([]);

  // Event State
  const [eventActive, setEventActive] = useState<{ name: string; boost: number } | null>(null);
  const eventTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Quantum Truck & Wheel State
  const [isQuantumTruckAvailable, setIsQuantumTruckAvailable] = useState(false);
  const [nextTruckToggle, setNextTruckToggle] = useState(Date.now() + 120000); // 2 mins
  const [isWheelAvailable, setIsWheelAvailable] = useState(false);
  const [nextWheelTime, setNextWheelTime] = useState(Date.now() + 300000); // 5 mins

  // Watching Video State
  const [isWatchingVideo, setIsWatchingVideo] = useState(false);

  // Input Keys Ref
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // --- FORMATTER HELPER ---
  const formatNumber = (num: number) => {
      if (num === 0) return "0";
      if (num < 1000) return Math.floor(num).toString();
      const suffixes = ["k", "m", "b", "t", "q", "Q", "s", "S"];
      const suffixNum = Math.floor(("" + Math.floor(num)).length / 3);
      let shortValue = parseFloat((suffixNum !== 0 ? (num / Math.pow(1000, suffixNum)) : num).toPrecision(3));
      if (shortValue % 1 !== 0) {
          shortValue = parseFloat(shortValue.toFixed(1));
      }
      return shortValue + suffixes[suffixNum - 1];
  };

  // --- LOGIC ---

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: Date.now(),
      type
    };
    setLogs(prev => [...prev.slice(-49), newLog]);
  };

  // Quantum Truck & Wheel Loop
  useEffect(() => {
      const interval = setInterval(() => {
          const now = Date.now();
          
          // Truck Logic (2 mins on, 2 mins off, repeats)
          if (now >= nextTruckToggle) {
              const newState = !isQuantumTruckAvailable;
              setIsQuantumTruckAvailable(newState);
              setNextTruckToggle(now + 120000); // Toggle every 2 mins
              if (newState) addLog("The Unlimited Quantum Truck has arrived!", 'event');
              else {
                  addLog("The Quantum Truck has vanished into the void.", 'info');
                  if (activeModal === 'quantum_truck') setActiveModal(null);
              }
          }

          // Wheel Logic (Every 5 mins)
          if (now >= nextWheelTime) {
              setIsWheelAvailable(true);
              setActiveModal('wheel'); // Force open wheel when ready? Or just notify? Let's force open.
              addLog("Lucky Spin Wheel is ready!", 'event');
              setNextWheelTime(now + 300000); // Reset for next 5 mins
          }

      }, 1000);
      return () => clearInterval(interval);
  }, [nextTruckToggle, isQuantumTruckAvailable, nextWheelTime, activeModal]);

  // Click Float Animation Loop
  useEffect(() => {
      const interval = setInterval(() => {
          setClicks(prev => prev.map(c => ({...c, y: c.y - 2, opacity: (c as any).opacity ? (c as any).opacity - 0.02 : 1.0})).filter(c => (c as any).opacity === undefined || (c as any).opacity > 0));
      }, 16);
      return () => clearInterval(interval);
  }, []);

  // Jail Timer
  useEffect(() => {
    if (isArrested) setIsArrested(false); // Auto release
  }, [isArrested]);

  // BATTERY DRAIN LOOP
  useEffect(() => {
    const batteryInterval = setInterval(() => {
        setOwnedTablets(current => current.map(t => {
            const currentBat = typeof t.battery === 'number' ? t.battery : 100;
            if (currentBat <= 0) return { ...t, battery: 0 };
            return { ...t, battery: Math.max(0, currentBat - 0.5) };
        }));
    }, 1000);
    return () => clearInterval(batteryInterval);
  }, []);

  // Income Calculation
  useEffect(() => {
    let base = ownedTablets.reduce((sum, t) => {
        const bat = typeof t.battery === 'number' ? t.battery : 100;
        if (bat <= 0) return sum;
        return sum + (t.baseIncome * (t.mutationMultiplier || 1));
    }, 0);
    
    let passMult = 1;
    GAME_PASSES.forEach(pass => {
        if (ownedGamePasses.includes(pass.id) && (pass.effect === 'income' || pass.id === 'pass_god')) {
            passMult *= pass.multiplier;
        }
    });
    
    const rebirthMult = rebirths > 0 ? REBIRTH_TIERS[Math.min(rebirths, REBIRTH_TIERS.length) - 1].multiplier : 1;

    // Apply Admin Traits Multiplier
    const finalMult = globalMultiplier * passMult * rebirthMult * traitMultiplier;
    setTotalMultiplier(finalMult);

    base = base * finalMult;
    
    const eventBoost = eventActive ? eventActive.boost : 0;
    
    setIncomePerSec(base + eventBoost);
  }, [ownedTablets, eventActive, globalMultiplier, ownedGamePasses, rebirths, traitMultiplier]);

  // Income Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney(prev => prev + incomePerSec);
    }, 1000);
    return () => clearInterval(interval);
  }, [incomePerSec]);

  // Random Event Loop
  useEffect(() => {
    const randomEventLoop = setInterval(() => {
        if (!eventActive && Math.random() < 0.05) {
            const validEvents = EVENTS.filter(e => !disabledEvents.includes(e.name));
            if (validEvents.length > 0) {
                const randomEvent = validEvents[Math.floor(Math.random() * validEvents.length)];
                activateEvent(randomEvent);
            }
        }
    }, 10000);
    return () => clearInterval(randomEventLoop);
  }, [eventActive, disabledEvents]);

  // Movement Loop
  useEffect(() => {
    const moveLoop = setInterval(() => {
      if (isArrested || activeModal || isWatchingVideo) {
          setIsMoving(false);
          return;
      }

      let dx = 0;
      let dy = 0;

      if (keysPressed.current['w'] || keysPressed.current['ArrowUp']) dy -= 1;
      if (keysPressed.current['s'] || keysPressed.current['ArrowDown']) dy += 1;
      if (keysPressed.current['a'] || keysPressed.current['ArrowLeft']) dx -= 1;
      if (keysPressed.current['d'] || keysPressed.current['ArrowRight']) dx += 1;

      if (joystick.active) {
        const deltaX = joystick.currentX - joystick.originX;
        const deltaY = joystick.currentY - joystick.originY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDist = 50;
        
        if (distance > 5) {
          dx = deltaX / maxDist;
          dy = deltaY / maxDist;
        }
      }

      const moving = dx !== 0 || dy !== 0;
      setIsMoving(moving);

      if (moving) {
        if (!joystick.active) {
           const len = Math.sqrt(dx*dx + dy*dy);
           dx /= len;
           dy /= len;
        }

        setPlayer(p => {
            const nextX = p.x + dx * p.speed;
            const nextY = p.y + dy * p.speed;
            return { ...p, x: nextX, y: nextY };
        });
      }
    }, 16); 

    return () => clearInterval(moveLoop);
  }, [joystick, isArrested, activeModal, isWatchingVideo]);

  // Keyboard Listeners
  useEffect(() => {
    const down = (e: KeyboardEvent) => keysPressed.current[e.key] = true;
    const up = (e: KeyboardEvent) => keysPressed.current[e.key] = false;
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // --- ACTIONS ---

  const getLuckFactor = () => {
      let luck = 1;
      if (ownedWeapons.some(w => w.id === 'amulet')) luck += 2; 
      GAME_PASSES.forEach(pass => {
          if (ownedGamePasses.includes(pass.id) && (pass.effect === 'luck' || pass.id === 'pass_god')) {
              luck *= pass.multiplier;
          }
      });
      luck *= adminLuckLevel;
      return luck;
  };

  const checkOGEventsByName = (name: string) => {
      if (disabledEvents.includes("Strawberry Event") || disabledEvents.includes("Headless Event") || disabledEvents.includes("La OP Event")) return;

      if (name === "Strawberry Elephant") {
          const evt = EVENTS.find(e => e.name === "Strawberry Event");
          if (evt) activateEvent(evt);
      } else if (name === "Headless Horseman") {
          const evt = EVENTS.find(e => e.name === "Headless Event");
          if (evt) activateEvent(evt);
      } else if (name === "The OP Collection") {
          const evt = EVENTS.find(e => e.name === "La OP Event");
          if (evt) activateEvent(evt);
      } 
  };

  // --- FINGERPRINT / VAULT LOGIC ---

  const handleVaultInteraction = () => {
      if (isVaultOpen) {
          setIsVaultOpen(false);
          addLog("Vault Locked Successfully.", 'info');
      } else {
          if (!hasFingerprint) {
              addLog("ACCESS DENIED: Fingerprint not registered.", 'failure');
              setActiveModal('settings');
              return;
          }
          setScannerMode('verify');
          setActiveModal('scanner');
      }
  };

  const handleEnrollFingerprint = () => {
      setScannerMode('enroll');
      setActiveModal('scanner');
  };

  const onScanComplete = (success: boolean) => {
      if (success) {
          if (scannerMode === 'enroll') {
              setHasFingerprint(true);
              setActiveModal(null);
              addLog("Fingerprint Registered Successfully!", 'success');
          } else {
              addLog("Identity Verified. Vault Unlocked.", 'success');
              setActiveModal('index');
              setIsVaultOpen(true);
          }
      } else {
          setActiveModal(null);
          addLog("Scan Failed.", 'failure');
      }
  };

  // --- UI HANDLERS ---

  const handleExchangeLimited = (costIds: string[], reward: Tablet) => {
      setOwnedTablets(prev => {
          const remaining = prev.filter(t => !costIds.includes(t.id));
          return [...remaining, { ...reward, battery: 100 }];
      });
      addLog(`QUANTUM TRADE: Acquired ${reward.name}!`, 'event');
      setLootResult({ tablet: reward, source: "QUANTUM TRUCK" });
  };

  const handleWheelReward = (prize: typeof SPIN_WHEEL_PRIZES[0]) => {
      setIsWheelAvailable(false);
      setActiveModal(null);

      if (prize.type === 'money') {
          setMoney(prev => prev + prize.value);
          addLog(`LUCKY SPIN: Won $${formatNumber(prize.value)}!`, 'success');
      } else if (prize.type === 'buff') {
          addLog("LUCKY SPIN: Income Buff Applied!", 'event');
          // Buff logic usually handled by a temp state, simulating via money for now or custom multiplier
          // For simplicity, let's just give money equivalent to 5 mins of buff
          setMoney(prev => prev + (incomePerSec * prize.value * 300)); 
      } else if (prize.type === 'item' && prize.id === 'lucky') {
          handleBuyLuckyBlock('legendary', 0); // Free legendary block
      } else if (prize.type === 'item_limited') {
          // Give random limited
          const lim = TABLETS.filter(t => t.rarity === 'Limited');
          const win = lim[Math.floor(Math.random() * lim.length)];
          handleLuckyBlockReward(win);
      } else if (prize.type === 'buff_speed') {
          setPlayer(p => ({ ...p, speed: 25 }));
          setTimeout(() => setPlayer(p => ({ ...p, speed: 8 })), 60000);
          addLog("SPEED BOOST ACTIVE!", 'event');
      } else if (prize.type === 'buff_luck') {
          setLuckyBlockLuck(2);
          setTimeout(() => setLuckyBlockLuck(1), 300000);
          addLog("LUCK BOOST ACTIVE!", 'event');
      } else {
          addLog("LUCKY SPIN: Nothing...", 'failure');
      }
  };

  const handleBuyStorage = () => {
    const currentUpgrades = (maxStorage - 60) / 10;
    const cost = 500 + (currentUpgrades * 500); 
    
    if (money >= cost) {
      setMoney(m => m - cost);
      setMaxStorage(s => s + 10);
      addLog(`Upgraded Storage to ${maxStorage + 10} slots!`, 'success');
    } else {
      addLog(`Need $${formatNumber(cost)} to upgrade storage.`, 'failure');
    }
  };

  const handleBuyPass = (passId: string) => {
      if (ownedGamePasses.includes(passId)) return;
      const pass = GAME_PASSES.find(p => p.id === passId);
      if (pass && money >= pass.price) {
          setMoney(m => m - pass.price);
          setOwnedGamePasses(prev => [...prev, pass.id]);
          addLog(`Purchased Game Pass: ${pass.name}!`, 'event');
      }
  };

  const handleBuyLuckyBlock = (type: string, cost: number) => {
      if (money >= cost) {
          if (ownedTablets.length >= maxStorage) {
              addLog("INVENTORY FULL! Sell items to buy blocks!", 'failure');
              return;
          }
          setMoney(m => m - cost);
          setActiveLuckyBlockType(type);
          setActiveModal('lucky'); // Triggers opening animation
      } else {
          addLog("Insufficient funds!", 'failure');
      }
  };

  const handleBuyLuckyBlockBulk = (count: number, cost: number) => {
      if (money >= cost) {
          if (ownedTablets.length + count > maxStorage) {
               addLog(`INVENTORY FULL! Not enough space for ${count} items.`, 'failure');
               return;
          }

          setMoney(m => m - cost);
          
          const newItems: Tablet[] = [];
          for (let i = 0; i < count; i++) {
               const roll = Math.random() * 100;
               let rarity = 'Common';
               if (roll > 98) rarity = 'Legendary';
               else if (roll > 85) rarity = 'Rare';
               
               const pool = TABLETS.filter(t => t.rarity === rarity);
               const item = pool[Math.floor(Math.random() * pool.length)] || TABLETS[0];
               
               newItems.push({
                   ...item,
                   id: Math.random().toString(36),
                   mutation: "Bulk",
                   battery: 100
               });
          }
          
          setOwnedTablets(prev => [...prev, ...newItems]);
          addLog(`BULK BUY: Opened ${count} Blocks!`, 'success');
      } else {
          addLog(`Need $${formatNumber(cost)} for bulk buy.`, 'failure');
      }
  };
  
  const handleBuyStarterPack = (packId: string) => {
      const pack = STARTER_PACKS.find(p => p.id === packId);
      if (!pack) return;
      
      if (money >= pack.price) {
          setMoney(m => m - pack.price);
          
          let newItems: Tablet[] = [];
          
          pack.items.forEach(item => {
              if (item.type === 'weapon') {
                 const weapon = WEAPONS.find(w => w.id === item.tabletId);
                 if (weapon && !ownedWeapons.some(w => w.id === weapon.id)) {
                     setOwnedWeapons(prev => [...prev, weapon]);
                 }
              } else {
                 const tablet = TABLETS.find(t => t.id === item.tabletId);
                 if (tablet) {
                     for(let i=0; i < item.count; i++) {
                         newItems.push({
                             ...tablet,
                             id: Math.random().toString(36),
                             mutation: 'Starter',
                             battery: 100
                         });
                     }
                 }
              }
          });
          
          if (newItems.length > 0) {
              setOwnedTablets(prev => [...prev, ...newItems]);
          }
          
          addLog(`Purchased ${pack.name}!`, 'success');
      }
  };

  // Called when LuckyBlockOpener finishes
  const handleLuckyBlockReward = (reward: Tablet) => {
      if (ownedTablets.length >= maxStorage) {
          addLog("INVENTORY FULL! Item lost to the void.", 'failure');
          setActiveModal('lucky_shop'); // Return to shop
          return;
      }

      // Check if we came from shop or not. 
      // Simplified: Always go back to lucky_shop for continuous buying.
      setActiveModal('lucky_shop');
      
      const newTablet = { ...reward, id: Math.random().toString(36), mutation: 'Lucky', battery: 100 };
      setOwnedTablets(prev => [...prev, newTablet]);
      setLootResult({ tablet: newTablet, source: "LUCKY BLOCK" });
      checkOGEventsByName(newTablet.name);
      addLog(`Opened Block: Found ${reward.name}!`, 'event');
  };

  const handleSellTablet = (id: string) => {
      const tablet = ownedTablets.find(t => t.id === id);
      if (tablet) {
          const sellValue = Math.floor(tablet.price * 0.5);
          setMoney(prev => prev + sellValue);
          setOwnedTablets(prev => prev.filter(t => t.id !== id));
          addLog(`Sold ${tablet.name} for $${formatNumber(sellValue)}`, 'info');
      }
  };
  
  const handleFuse = (consumedIds: string[], reward: Tablet) => {
      setOwnedTablets(prev => {
          const remaining = prev.filter(t => !consumedIds.includes(t.id));
          return [...remaining, { ...reward, battery: 100 }];
      });
      addLog(`FUSE SUCCESSFUL! Created ${reward.name} (${reward.rarity})`, 'event');
      setLootResult({ tablet: reward, source: "WITCH'S POT" });
      checkOGEventsByName(reward.name);
  };

  const handleCraft = (consumedIds: string[], reward: Tablet) => {
      setOwnedTablets(prev => {
          const remaining = prev.filter(t => !consumedIds.includes(t.id));
          return [...remaining, { ...reward, battery: 100 }];
      });
      addLog(`CRAFT SUCCESSFUL! Assembled ${reward.name}!`, 'event');
      setLootResult({ tablet: reward, source: "LABORATORY CRAFT" });
      checkOGEventsByName(reward.name);
  };

  const handleTrade = (consumedIds: string[], reward: Tablet) => {
      setOwnedTablets(prev => {
          const remaining = prev.filter(t => !consumedIds.includes(t.id));
          return [...remaining, { ...reward, battery: 100 }];
      });
      addLog(`TRADE SUCCESSFUL! Received ${reward.name}!`, 'event');
      setLootResult({ tablet: reward, source: "TRADER DEAL" });
      checkOGEventsByName(reward.name);
  };

  const handleSkipTime = (cost: number) => {
      if (money >= cost) {
          setMoney(prev => prev - cost);
          addLog("PAID TO SKIP WAIT TIME.", 'event');
      }
  };

  // --- REBIRTH LOGIC ---
  const handleRebirth = () => {
      const nextTier = REBIRTH_TIERS[rebirths];
      if (nextTier && money >= nextTier.cost) {
          setMoney(0);
          setOwnedTablets([]); 
          setOwnedWeapons([]);
          setMaxStorage(64);
          setHasFastCharger(false);
          setGlobalMultiplier(1);
          setRebirths(prev => prev + 1);
          setActiveModal(null);
          addLog(`REBIRTH SUCCESSFUL! Level ${rebirths + 1} Reached!`, 'event');
      }
  };

  const handleChargeAll = () => {
    if (hasFastCharger) {
        setOwnedTablets(prev => prev.map(t => ({ ...t, battery: 100 })));
        addLog("FAST CHARGE: All tablets at 100%!", 'success');
    } else {
        setOwnedTablets(prev => prev.map(t => ({ ...t, battery: Math.min(100, (t.battery || 0) + 10) })));
        addLog("Charged tablets (+10%).", 'info');
    }
  };

  const handleBuyFastCharger = () => {
      if (money >= 10000) {
          setMoney(m => m - 10000);
          setHasFastCharger(true);
          addLog("Purchased FAST CHARGER!", 'success');
      }
  };

  // --- EVENTS & ADMIN ---

  const handleWatchVideo = () => {
      setIsWatchingVideo(true);
      addLog("Watching Ad...", 'info');
      setTimeout(() => {
          setIsWatchingVideo(false);
          const reward = 500 * (ownedTablets.length || 1);
          setMoney(prev => prev + reward);
          addLog(`Ad Complete! You earned $${formatNumber(reward)}`, 'success');
      }, 3000); 
  };

  const activateEvent = (evt: typeof EVENTS[0]) => {
    if (disabledEvents.includes(evt.name)) {
        addLog(`Event blocked: ${evt.name}`, 'info');
        return;
    }

    const duration = eventDurationMinutes * 60 * 1000;
    setEventActive({ name: evt.name, boost: evt.boost });
    addLog(`EVENT STARTED: ${evt.message}`, 'event');

    if (eventTimeoutRef.current) clearTimeout(eventTimeoutRef.current);
    eventTimeoutRef.current = setTimeout(() => {
      setEventActive(null);
      if (chaosMode) setChaosMode(false); 
      addLog(`Event "${evt.name}" ended.`, 'info');
    }, duration);
  };

  const triggerChaosMode = () => {
      setChaosMode(true);
      setAdminSlapActive(true); 
      
      const totalBoost = EVENTS.filter(e => !disabledEvents.includes(e.name)).reduce((acc, curr) => acc + curr.boost, 0);
      
      setEventActive({ name: "ADMIN ABUSE", boost: totalBoost });
      addLog("ADMIN SLAP! ALL EVENTS TRIGGERED!", 'admin');
      setTimeout(() => setAdminSlapActive(false), 2000); 
      
      if (eventTimeoutRef.current) clearTimeout(eventTimeoutRef.current);
      eventTimeoutRef.current = setTimeout(() => {
        setEventActive(null);
        setChaosMode(false); 
        addLog(`ADMIN ABUSE ENDED.`, 'info');
      }, 30000);
  };

  const spawnAdminTablet = (tablet: Tablet) => {
      if (ownedTablets.length >= maxStorage) {
         addLog("Inventory Full (Admin Spawn Failed)", 'failure');
         return;
      }
      
      const finalTablet: Tablet = {
          ...tablet,
          id: Math.random().toString(36),
          mutation: "OG",
          mutationMultiplier: 1,
          battery: 100
      };
      
      setOwnedTablets(prev => [...prev, finalTablet]);
      setLootResult({ tablet: finalTablet, source: "ADMIN SPAWN" });
      addLog(`ADMIN: Spawned ${finalTablet.name}`, 'admin');
      
      checkOGEventsByName(tablet.name);
  };

  const buyMultiplier = () => {
      const cost = 10_000_000 * Math.pow(5, (Math.log2(globalMultiplier))); 
      if (money >= cost) {
          if (confirm(`Upgrade Money Multiplier to ${globalMultiplier * 2}x? Cost: $${formatNumber(cost)}`)) {
              setMoney(m => m - cost);
              setGlobalMultiplier(prev => prev * 2);
              addLog(`UPGRADE: Income Multiplier is now ${globalMultiplier * 2}x!`, 'event');
          }
      }
  };

  // --- COMMANDS ---
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const [cmd, ...args] = chatInput.trim().split(' ');
    
    switch(cmd.toLowerCase()) {
        case '/help':
            addLog("Cmds: /admin (enable admin), /money [amt]", 'info');
            break;
        case '/owner':
        case '/admin':
            setIsOwner(true);
            addLog("Admin Mode Enabled.", 'admin');
            break;
        case '/money':
            const amount = parseInt(args[0]);
            if (!isNaN(amount) && isOwner) setMoney(prev => prev + amount); 
            break;
        case '/rebirth':
            const reb = parseInt(args[0]);
            if (!isNaN(reb) && isOwner) setRebirths(reb);
            break;
        case '/clear':
            setLogs([]);
            break;
        default:
            addLog("Unknown command.", 'failure');
    }
    setChatInput("");
    setShowChat(false);
  };

  // --- JOYSTICK ---
  const handleTouchStart = (e: React.TouchEvent) => {
      if (isArrested || activeModal || isWatchingVideo) return; 
      const touch = e.touches[0];
      if (touch.clientY < window.innerHeight - 150) { 
        setJoystick({
            active: true,
            originX: touch.clientX,
            originY: touch.clientY,
            currentX: touch.clientX,
            currentY: touch.clientY
        });
      }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      if (joystick.active) {
        const touch = e.touches[0];
        setJoystick(prev => ({ ...prev, currentX: touch.clientX, currentY: touch.clientY }));
      }
  };

  const handleTouchEnd = () => {
      setJoystick(prev => ({ ...prev, active: false }));
  };

  const handleHack = (e: React.PointerEvent<HTMLButtonElement>) => {
      // Manual clicker button
      const gain = 100 * totalMultiplier;
      setMoney(prev => prev + gain);
      
      // Floating text effect
      const clientX = e.clientX;
      const clientY = e.clientY;
      
      setClicks(prev => [
          ...prev, 
          { id: clickIdRef.current++, x: clientX, y: clientY, value: `+$${formatNumber(gain)}` }
      ]);
  };

  return (
    <div 
        className="relative w-screen h-screen overflow-hidden font-sans select-none bg-black"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
      <GameCanvas 
        player={player}
        isStealing={isStealing}
        eventActive={!!eventActive}
        activeEventName={eventActive?.name || null}
        isMoving={isMoving}
        chaosMode={chaosMode}
      />

      <AIAssistant ownedTablets={ownedTablets} money={money} />

      {/* Floating Click Text */}
      {clicks.map(click => (
          <div 
            key={click.id} 
            className="absolute pointer-events-none text-green-400 font-bold text-2xl animate-out fade-out slide-out-to-top duration-1000 z-[100]"
            style={{ left: click.x, top: click.y, textShadow: '0 0 5px black' }}
          >
              {click.value}
          </div>
      ))}

      {serverMessage && (
          <div className="fixed top-24 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
             <div className="bg-black/90 text-yellow-400 font-black text-xl md:text-3xl px-8 py-4 rounded-2xl animate-bounce border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.5)] text-center">
                <div className="text-xs text-white uppercase tracking-[0.3em] mb-1">Server Announcement</div>
                {serverMessage}
             </div>
          </div>
      )}

      {isWatchingVideo && (
          <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center">
              <div className="text-white text-2xl font-bold animate-pulse">WATCHING AD...</div>
              <div className="text-gray-500 text-sm mt-2">Loading Reward...</div>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mt-4"></div>
          </div>
      )}

      {adminSlapActive && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden">
               <div className="text-[20rem] animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_infinite]">👋</div>
               <div className="absolute text-9xl font-black text-red-500 animate-[bounce_0.2s_infinite]">SLAPPED!</div>
          </div>
      )}

      {/* HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="glass-panel p-3 rounded-lg min-w-[160px]">
          <div className="text-xs text-gray-400 font-bold tracking-wider">BALANCE</div>
          <div className="text-2xl font-mono text-green-400 font-bold">${formatNumber(Math.floor(money))}</div>
        </div>
        <div className="glass-panel p-3 rounded-lg min-w-[160px] relative overflow-hidden">
          <div className="text-xs text-gray-400 font-bold tracking-wider">INCOME</div>
          <div className="text-lg font-mono text-blue-400 relative z-10">${formatNumber(Math.floor(incomePerSec))}/s</div>
          {totalMultiplier > 1 && (
             <div className="absolute top-1 right-1 bg-green-500 text-black text-[10px] font-black px-1.5 rounded z-10 animate-pulse">
                x{formatNumber(totalMultiplier)}
             </div>
          )}
          {rebirths > 0 && (
              <div className="absolute bottom-1 right-1 bg-rose-500 text-black text-[10px] font-black px-1.5 rounded z-10">
                  R{rebirths}
              </div>
          )}
        </div>
      </div>

      {/* Top Right Buttons */}
      <div className="absolute top-4 right-4 z-20 flex gap-2 pointer-events-auto">
        <button 
            onClick={() => setActiveModal('admin')}
            className="glass-panel p-2 rounded-full hover:bg-red-500/20 active:scale-95 transition-all text-xs text-red-500 font-bold border-red-900 shadow-[0_0_10px_red]"
        >
            ADMIN
        </button>
        <button onClick={() => setShowChat(!showChat)} className="glass-panel p-3 rounded-full hover:bg-white/10 active:scale-95">💬</button>
        <button onClick={() => setActiveModal('settings')} className="glass-panel p-3 rounded-full hover:bg-white/10 active:scale-95">⚙️</button>
        <button onClick={() => { setActiveModal('index'); setIsVaultOpen(false); }} className="glass-panel p-3 rounded-full hover:bg-white/10 active:scale-95">🎒</button>
      </div>

      <div className="absolute bottom-36 left-4 z-10 w-64 pointer-events-auto opacity-80 hover:opacity-100 transition-opacity">
          <ActionLog logs={logs} />
      </div>

      {showChat && (
          <div className="absolute top-20 right-4 z-30 w-64">
              <form onSubmit={handleCommand} className="glass-panel p-2 rounded-lg flex gap-2">
                  <input autoFocus type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} className="bg-black/50 text-white p-2 rounded w-full outline-none text-sm font-mono" />
                  <button type="submit" className="bg-blue-600 px-3 rounded text-xs font-bold">></button>
              </form>
          </div>
      )}

      {joystick.active && !activeModal && (
          <div className="absolute z-10 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm pointer-events-none" style={{ width: 100, height: 100, left: joystick.originX - 50, top: joystick.originY - 50 }}>
              <div className="absolute rounded-full bg-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.5)]" style={{ width: 40, height: 40, left: 30 + (joystick.currentX - joystick.originX), top: 30 + (joystick.currentY - joystick.originY), transform: 'translate(-50%, -50%)' }} />
          </div>
      )}
      
      {/* Side Dealers */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-20 pointer-events-auto flex flex-col gap-2 pl-2">
           <button 
                onClick={() => setActiveModal('showroom')}
                className="bg-red-700 border-r-4 border-red-500 p-4 rounded-r-xl shadow-lg hover:bg-red-600 transition-transform active:scale-95 flex flex-col items-center"
           >
               <span className="text-3xl">📸</span>
               <span className="text-[10px] font-bold text-white uppercase mt-1 rotate-180" style={{writingMode: 'vertical-rl'}}>CARPET</span>
           </button>
           <button 
                onClick={() => setActiveModal('machine')}
                className="bg-cyan-700 border-r-4 border-cyan-500 p-4 rounded-r-xl shadow-lg hover:bg-cyan-600 transition-transform active:scale-95 flex flex-col items-center"
           >
               <span className="text-3xl">⚙️</span>
               <span className="text-[10px] font-bold text-white uppercase mt-1 rotate-180" style={{writingMode: 'vertical-rl'}}>MACHINE</span>
           </button>
      </div>

      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-20 pointer-events-auto flex flex-col gap-2 pr-2 items-end">
           <button 
                onClick={() => setActiveModal('trader')}
                className="bg-orange-600 border-l-4 border-orange-400 p-4 rounded-l-xl shadow-lg hover:bg-orange-500 transition-transform active:scale-95 flex flex-col items-center w-16"
           >
               <span className="text-3xl">⚖️</span>
               <span className="text-[10px] font-bold text-white uppercase mt-1" style={{writingMode: 'vertical-rl'}}>TRADER</span>
           </button>

           {/* Lucky Shop Button */}
           <button 
                onClick={() => setActiveModal('lucky_shop')}
                className="bg-purple-600 border-l-4 border-purple-400 p-4 rounded-l-xl shadow-lg hover:bg-purple-500 transition-transform active:scale-95 flex flex-col items-center w-16"
           >
               <span className="text-3xl">🎰</span>
               <span className="text-[10px] font-bold text-white uppercase mt-1" style={{writingMode: 'vertical-rl'}}>LUCKY</span>
           </button>

           {/* QUANTUM TRUCK (Conditional) */}
           {isQuantumTruckAvailable && (
               <button 
                    onClick={() => setActiveModal('quantum_truck')}
                    className="bg-black border-l-4 border-orange-600 p-4 rounded-l-xl shadow-[0_0_20px_orange] hover:bg-orange-900 transition-transform active:scale-95 flex flex-col items-center w-16 animate-pulse"
               >
                   <span className="text-3xl">🚚</span>
                   <span className="text-[10px] font-bold text-orange-400 uppercase mt-1" style={{writingMode: 'vertical-rl'}}>VOID</span>
               </button>
           )}
      </div>

      {/* Safe Vault Button */}
      <div className="absolute top-24 right-4 z-20 pointer-events-auto">
          <button 
            onClick={handleVaultInteraction}
            className={`w-12 h-12 border-2 rounded-full flex items-center justify-center shadow-[0_0_10px_cyan] active:scale-90 transition-transform 
                ${isVaultOpen ? 'bg-green-600 border-green-400' : hasFingerprint ? 'bg-slate-800 border-cyan-400 hover:bg-slate-700' : 'bg-red-900 border-red-500 hover:bg-red-800'}
            `}
          >
              <span className="text-xl">{isVaultOpen ? '🔓' : hasFingerprint ? '🔐' : '🚫'}</span>
          </button>
          <div className={`text-[10px] font-bold text-center mt-1 bg-black/60 rounded ${isVaultOpen ? 'text-green-400' : hasFingerprint ? 'text-cyan-400' : 'text-red-400'}`}>
              {isVaultOpen ? 'LOCK' : hasFingerprint ? 'SAFE' : 'LOCKED'}
          </div>
      </div>

      {/* Bottom Menu */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 flex items-end justify-center gap-2 pointer-events-auto bg-gradient-to-t from-black to-transparent h-32">
          
          <button 
            onClick={() => setActiveModal('shop')}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
             <div className="w-12 h-12 rounded-xl bg-indigo-700 border-2 border-indigo-400 flex items-center justify-center shadow-lg hover:bg-indigo-600">
                🛒
             </div>
             <span className="text-[10px] font-bold text-white bg-black/50 px-2 rounded">SHOP</span>
          </button>

          <button 
            onClick={() => setActiveModal('fuse')}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
             <div className="w-12 h-12 rounded-xl bg-purple-700 border-2 border-purple-400 flex items-center justify-center shadow-lg hover:bg-purple-600">
                🧬
             </div>
             <span className="text-[10px] font-bold text-white bg-black/50 px-2 rounded">FUSE</span>
          </button>
          
          {/* HACK BUTTON (Replaced Buy) */}
          <button 
            onPointerDown={handleHack}
            className={`
                w-20 h-20 rounded-full border-4 shadow-2xl flex items-center justify-center -translate-y-2
                backdrop-blur-md active:scale-95 transition-all duration-75 select-none
                bg-red-600/90 border-red-400 hover:bg-red-500 animate-[pulse_2s_infinite]
            `}
          >
             <span className="font-black text-white text-xl drop-shadow-md">
                 HACK
             </span>
          </button>

          <button 
            onClick={() => setActiveModal('craft')}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
             <div className="w-12 h-12 rounded-xl bg-cyan-700 border-2 border-cyan-400 flex items-center justify-center shadow-lg hover:bg-cyan-600">
                🛠️
             </div>
             <span className="text-[10px] font-bold text-white bg-black/50 px-2 rounded">CRAFT</span>
          </button>

          <button 
            onClick={() => setActiveModal('rebirth')}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
             <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center shadow-lg 
                 bg-rose-600 border-rose-400 hover:bg-rose-500
             `}>
                💀
             </div>
             <span className="text-[10px] font-bold text-white bg-black/50 px-2 rounded">REBIRTH</span>
          </button>
      </div>

      {/* --- MODALS --- */}
      
      {activeModal === 'settings' && (
          <SettingsMenu
             onClose={() => setActiveModal(null)}
             hasFaceID={hasFingerprint}
             onSetupFaceID={handleEnrollFingerprint}
             onResetFaceID={() => setHasFingerprint(false)}
             bgMusicVolume={0.5}
             setBgMusicVolume={() => {}}
          />
      )}

      {activeModal === 'scanner' && (
          <FingerprintScanner
             onClose={() => setActiveModal(null)}
             onSuccess={onScanComplete}
             mode={scannerMode}
          />
      )}

      {activeModal === 'rebirth' && (
          <RebirthMenu
             currentRebirths={rebirths}
             money={money}
             onRebirth={handleRebirth}
             onClose={() => setActiveModal(null)}
          />
      )}

      {activeModal === 'shop' && (
        <Shop 
          money={money} 
          onBuyTablet={(t) => {
              if (money >= t.price) {
                  setMoney(m => m - t.price);
                  setOwnedTablets(prev => [...prev, { ...t, id: Math.random().toString(36), battery: 100 }]);
                  addLog(`Bought ${t.name}`, 'info');
              }
          }}
          onBuyWeapon={(w) => {
               if (typeof w.price === 'number' && money >= w.price) {
                  setMoney(m => m - (w.price as number));
                  setOwnedWeapons(prev => [...prev, w]);
                  addLog(`Bought ${w.name}`, 'info');
               }
          }}
          onBuyStorage={handleBuyStorage}
          maxStorage={maxStorage}
          onBuyPass={handleBuyPass}
          ownedPasses={ownedGamePasses}
          onBuyStarterPack={handleBuyStarterPack}
          ownedWeapons={ownedWeapons}
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'lucky_shop' && (
          <LuckyBlockShop 
             money={money}
             onBuyLuckyBlock={handleBuyLuckyBlock}
             onBuyLuckyBlockBulk={handleBuyLuckyBlockBulk}
             onClose={() => setActiveModal(null)}
          />
      )}
      
      {activeModal === 'lucky' && (
          <LuckyBlockOpener
             blockType={activeLuckyBlockType}
             onComplete={handleLuckyBlockReward}
             onClose={() => setActiveModal(null)}
             luckLevel={luckyBlockLuck}
          />
      )}

      {activeModal === 'index' && (
        <TabletIndex 
          ownedTablets={ownedTablets} 
          maxStorage={maxStorage}
          onClose={() => setActiveModal(null)}
          onSell={handleSellTablet}
          isVaultMode={isVaultOpen}
          hasFastCharger={hasFastCharger}
          onBuyFastCharger={handleBuyFastCharger}
          onChargeAll={handleChargeAll}
        />
      )}

      {activeModal === 'fuse' && (
        <FuseMachine
            ownedTablets={ownedTablets}
            onFuse={handleFuse}
            onClose={() => setActiveModal(null)}
            fuseLuckActive={eventActive?.name === "Fuse Luck Event"}
            money={money}
            onSkipFuse={handleSkipTime}
        />
      )}
      
      {activeModal === 'craft' && (
        <CraftMachine
            ownedTablets={ownedTablets}
            onCraft={handleCraft}
            onClose={() => setActiveModal(null)}
            money={money}
            onSkipCraft={handleSkipTime}
        />
      )}
      
      {activeModal === 'trader' && (
        <Trader
            ownedTablets={ownedTablets}
            onTrade={handleTrade}
            onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'machine' && (
          <TabletMachine
              money={money}
              onBuy={(t, cost) => {
                  if (money >= cost) {
                      setMoney(m => m - cost);
                      setOwnedTablets(prev => [...prev, { ...t, id: Math.random().toString(36), battery: 100 }]);
                      addLog(`Created ${t.name}`, 'success');
                  }
              }}
              onClose={() => setActiveModal(null)}
          />
      )}
      
      {activeModal === 'showroom' && (
        <RedCarpetShowroom 
           money={money}
           luckLevel={getLuckFactor()} 
           onBuy={(t) => {
               if (money >= t.price) {
                  setMoney(m => m - t.price);
                  setOwnedTablets(prev => [...prev, { ...t, id: Math.random().toString(36), battery: 100 }]);
                  addLog(`Bought ${t.name} from Red Carpet!`, 'info');
                  setActiveModal(null);
              }
           }}
           onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'admin' && (
        <AdminMenu 
          onClose={() => setActiveModal(null)}
          onTriggerEvent={(name) => {
              const evt = EVENTS.find(e => e.name === name);
              if (evt) activateEvent(evt);
          }}
          onTriggerAllEvents={triggerChaosMode}
          onSpawnTablet={spawnAdminTablet}
          luckLevel={adminLuckLevel}
          setLuckLevel={setAdminLuckLevel}
          eventDuration={eventDurationMinutes}
          setEventDuration={setEventDurationMinutes}
          luckyBlockLuck={luckyBlockLuck}
          setLuckyBlockLuck={setLuckyBlockLuck}
          playerName={player.name}
          setPlayerName={(name) => setPlayer(p => ({ ...p, name }))}
          playerColor={player.color}
          setPlayerColor={(color) => setPlayer(p => ({ ...p, color }))}
          globalMultiplier={globalMultiplier}
          setGlobalMultiplier={setGlobalMultiplier}
          serverMessage={serverMessage}
          setServerMessage={setServerMessage}
          disabledEvents={disabledEvents}
          toggleEventDisabled={(name) => {
              if (disabledEvents.includes(name)) {
                  setDisabledEvents(prev => prev.filter(e => e !== name));
              } else {
                  setDisabledEvents(prev => [...prev, name]);
              }
          }}
          traitMultiplier={traitMultiplier}
          setTraitMultiplier={setTraitMultiplier}
        />
      )}

      {activeModal === 'quantum_truck' && (
          <QuantumTruck 
             isVisible={isQuantumTruckAvailable}
             nextToggleTime={nextTruckToggle}
             ownedTablets={ownedTablets}
             onExchange={handleExchangeLimited}
             onClose={() => setActiveModal(null)}
          />
      )}

      {activeModal === 'wheel' && (
          <SpinningWheel
             onSpinComplete={handleWheelReward}
             onClose={() => setActiveModal(null)}
          />
      )}

      {lootResult && (
          <LootPopup 
             data={lootResult}
             ownedTablets={ownedTablets}
             onClose={() => setLootResult(null)}
          />
      )}
    </div>
  );
};

export default App;
