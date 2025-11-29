
import React, { useState, useEffect, useRef } from 'react';
import { SPIN_WHEEL_PRIZES } from '../constants';

interface SpinningWheelProps {
  onSpinComplete: (prize: typeof SPIN_WHEEL_PRIZES[0]) => void;
  onClose: () => void;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ onSpinComplete, onClose }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<typeof SPIN_WHEEL_PRIZES[0] | null>(null);

  const startSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Random rotations (5 to 10 full spins) + random segment offset
    const spins = 5 + Math.random() * 5;
    const segmentAngle = 360 / SPIN_WHEEL_PRIZES.length;
    // Calculate winning index randomly
    const winningIndex = Math.floor(Math.random() * SPIN_WHEEL_PRIZES.length);
    // Calculate target rotation to land on that index
    // Note: 0 degrees is usually 3 o'clock or 12 o'clock depending on CSS. 
    // Let's assume top pointer. 
    // We need to rotate such that the winning segment is at the top.
    const offset = (360 - (winningIndex * segmentAngle)) + (Math.random() * segmentAngle * 0.8); // Add randomness within segment
    
    const totalRotation = spins * 360 + offset;

    setRotation(totalRotation);

    setTimeout(() => {
        setPrize(SPIN_WHEEL_PRIZES[winningIndex]);
        setIsSpinning(false);
    }, 5000); // 5s spin time matches CSS
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in zoom-in duration-300">
      <div className="flex flex-col items-center">
        
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-8 drop-shadow-lg animate-pulse">
            LUCKY SPIN
        </h2>

        {/* Wheel Container */}
        <div className="relative w-80 h-80 md:w-96 md:h-96">
            
            {/* Pointer */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-600 drop-shadow-xl"></div>

            {/* The Wheel */}
            <div 
                className="w-full h-full rounded-full border-8 border-yellow-600 shadow-[0_0_50px_rgba(234,179,8,0.5)] overflow-hidden relative transition-transform cubic-bezier(0.1, 0.7, 0.1, 1)"
                style={{ 
                    transform: `rotate(${rotation}deg)`, 
                    transitionDuration: '5000ms' 
                }}
            >
                {SPIN_WHEEL_PRIZES.map((item, index) => {
                    const angle = 360 / SPIN_WHEEL_PRIZES.length;
                    const rotate = index * angle;
                    const color = index % 2 === 0 ? '#1e293b' : '#334155'; // Alternating slate
                    
                    return (
                        <div 
                            key={index}
                            className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left flex items-center justify-center"
                            style={{ 
                                transform: `rotate(${rotate}deg) skewY(-${90 - angle}deg)`,
                                backgroundColor: color,
                                borderRight: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <div 
                                className="absolute text-xs md:text-sm font-bold text-white whitespace-nowrap"
                                style={{ 
                                    transform: `skewY(${90 - angle}deg) rotate(${angle/2}deg) translate(60px, 0)`,
                                    textAlign: 'right'
                                }}
                            >
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Center Cap */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-700 rounded-full shadow-inner border-4 border-white z-10 flex items-center justify-center">
                <span className="text-2xl">🎰</span>
            </div>
        </div>

        {/* Controls / Result */}
        <div className="mt-8 text-center h-24">
            {!prize && !isSpinning && (
                <button 
                    onClick={startSpin}
                    className="bg-green-600 hover:bg-green-500 text-white font-black text-2xl py-4 px-12 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-bounce"
                >
                    SPIN FREE
                </button>
            )}
            
            {prize && (
                <div className="animate-in zoom-in duration-300">
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">YOU WON</div>
                    <div className="text-3xl font-black text-yellow-400 mt-1 mb-4">{prize.label}</div>
                    <button 
                        onClick={() => onSpinComplete(prize)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-8 rounded-lg"
                    >
                        CLAIM
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default SpinningWheel;
