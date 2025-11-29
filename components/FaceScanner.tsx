
import React, { useState, useEffect, useRef } from 'react';

interface FaceScannerProps {
  onSuccess: (success: boolean) => void;
  onClose: () => void;
  mode: 'enroll' | 'verify';
}

const FingerprintScanner: React.FC<FaceScannerProps> = ({ onSuccess, onClose, mode }) => {
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'fail'>('idle');
  
  const intervalRef = useRef<any>(null);

  const startScan = () => {
    if (status === 'success') return;
    setIsScanning(true);
    setStatus('scanning');
    
    // Reset if starting fresh
    if (progress >= 100) setProgress(0);

    const speed = mode === 'enroll' ? 2 : 5; // Enroll is slower

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          handleSuccess();
          return 100;
        }
        return prev + speed;
      });
    }, 50);
  };

  const stopScan = () => {
    if (status === 'success') return;
    setIsScanning(false);
    setStatus('idle');
    clearInterval(intervalRef.current);
    setProgress(0); // Reset on let go (security feature)
  };

  const handleSuccess = () => {
    setStatus('success');
    setIsScanning(false);
    setTimeout(() => {
        onSuccess(true);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 flex flex-col items-center justify-center font-mono select-none">
      
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">
            {mode === 'enroll' ? 'Fingerprint Setup' : 'Security Check'}
        </h2>
        <p className="text-cyan-400 text-sm">
            {status === 'success' ? 'ACCESS GRANTED' : mode === 'enroll' ? 'Hold Scanner to Enroll' : 'Hold to Unlock Vault'}
        </p>
      </div>

      {/* Scanner Pad */}
      <div 
        className={`relative w-64 h-80 rounded-t-full rounded-b-3xl border-4 flex items-center justify-center transition-all duration-300
            ${status === 'success' ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.5)]' : 
              isScanning ? 'border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.3)]' : 'border-slate-600'}
        `}
        onMouseDown={startScan}
        onMouseUp={stopScan}
        onMouseLeave={stopScan}
        onTouchStart={startScan}
        onTouchEnd={stopScan}
      >
        {/* Scanning Line */}
        {isScanning && status !== 'success' && (
            <div 
                className="absolute top-0 left-0 right-0 h-2 bg-cyan-400 shadow-[0_0_20px_cyan] z-10 opacity-80"
                style={{ top: `${progress}%`, transition: 'top 0.05s linear' }}
            ></div>
        )}

        {/* Fingerprint Icon SVG */}
        <svg 
            viewBox="0 0 100 100" 
            className={`w-40 h-40 transition-all duration-500
                ${status === 'success' ? 'text-green-500' : isScanning ? 'text-cyan-400' : 'text-slate-600'}
            `}
            fill="currentColor"
        >
             <path d="M50,10 C35,10 25,25 25,40 C25,48 20,55 15,60 M85,60 C80,55 75,48 75,40 C75,25 65,10 50,10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
             <path d="M50,25 C40,25 35,35 35,45 C35,55 30,60 25,65 M75,65 C70,60 65,55 65,45 C65,35 60,25 50,25" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
             <path d="M50,40 C45,40 42,45 42,50 C42,60 38,65 35,70 M65,70 C62,65 58,60 58,50 C58,45 55,40 50,40" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
             <path d="M50,55 L50,85" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>

        {/* Success Check */}
        {status === 'success' && (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-t-full rounded-b-3xl animate-in zoom-in">
                 <span className="text-8xl text-green-500">✓</span>
             </div>
        )}
      </div>

      <div className="mt-8 w-64">
         <div className="flex justify-between text-xs text-gray-500 mb-1 font-bold">
            <span>VERIFICATION</span>
            <span>{Math.floor(progress)}%</span>
         </div>
         <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
             <div 
                className={`h-full transition-all duration-75 ${status === 'success' ? 'bg-green-500' : 'bg-cyan-500'}`}
                style={{ width: `${progress}%` }}
             ></div>
         </div>
      </div>

      <button 
        onClick={onClose}
        className="mt-8 text-gray-500 hover:text-white font-bold"
      >
          CANCEL
      </button>

      <div className="fixed bottom-4 text-slate-700 text-xs text-center pointer-events-none">
          SECURE BIOMETRIC SYSTEMS v2.0
      </div>
    </div>
  );
};

export default FingerprintScanner;
