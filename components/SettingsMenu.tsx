
import React from 'react';

interface SettingsMenuProps {
  onClose: () => void;
  hasFaceID: boolean;
  onSetupFaceID: () => void;
  onResetFaceID: () => void;
  bgMusicVolume: number;
  setBgMusicVolume: (vol: number) => void; // Placeholder for future use
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ 
    onClose, 
    hasFaceID, 
    onSetupFaceID, 
    onResetFaceID,
    bgMusicVolume,
    setBgMusicVolume
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-600 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">System Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Fingerprint / Face ID Section */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">👆</span>
                        <div>
                            <h3 className="font-bold text-white">Fingerprint Security</h3>
                            <p className="text-xs text-gray-400">Biometric protection for your Vault.</p>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${hasFaceID ? 'bg-green-900 text-green-400 border border-green-700' : 'bg-red-900 text-red-400 border border-red-700'}`}>
                        {hasFaceID ? 'Active' : 'Not Set'}
                    </div>
                </div>

                {hasFaceID ? (
                    <button 
                        onClick={onResetFaceID}
                        className="w-full py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-900 rounded font-bold transition-colors text-sm"
                    >
                        RESET FINGERPRINT
                    </button>
                ) : (
                    <button 
                        onClick={onSetupFaceID}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2"
                    >
                        <span>👆</span> REGISTER FINGERPRINT
                    </button>
                )}
                {!hasFaceID && <p className="text-[10px] text-gray-500 mt-2 text-center">Required to access your Safe.</p>}
            </div>

            {/* Audio Settings Placeholder */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 opacity-50">
                <h3 className="font-bold text-gray-400 mb-2 text-sm">Audio (Coming Soon)</h3>
                <input type="range" disabled className="w-full accent-slate-500" />
            </div>

        </div>

        <div className="p-4 bg-slate-950 text-center text-xs text-gray-600">
            v1.0.5 - SECURE OS
        </div>

      </div>
    </div>
  );
};

export default SettingsMenu;
