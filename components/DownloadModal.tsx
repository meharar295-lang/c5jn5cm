
import React from 'react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-gray-800 border border-gray-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Get the Mobile App</h2>
          <p className="text-gray-400 text-sm mb-6">
            Take your AI studio anywhere. Install the app on your phone for faster access and exclusive features.
          </p>

          <div className="space-y-3 mb-8">
            <button className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl border border-gray-700 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-gray-400 leading-none">Download on the</div>
                <div className="text-lg font-semibold leading-none">App Store</div>
              </div>
            </button>

            <button className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl border border-gray-700 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.81,16.27C19.44,16.63 20.19,16.63 20.82,16.27C21.45,15.91 21.84,15.24 21.84,14.53V9.47C21.84,8.76 21.45,8.09 20.82,7.73C20.19,7.37 19.44,7.37 18.81,7.73L16.81,8.88L14.4,11.29L16.81,15.12M13.69,12L16.81,8.88L5.25,2.21C5.11,2.12 4.96,2.07 4.81,2.04L13.69,12M13.69,12L4.81,21.96C4.96,21.93 5.11,21.88 5.25,21.79L13.69,12Z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-gray-400 leading-none">Get it on</div>
                <div className="text-lg font-semibold leading-none">Google Play</div>
              </div>
            </button>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-700/50 mb-6 text-center">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-3">Install as Web App</p>
            <div className="flex items-center gap-4 text-left justify-center">
              <div className="flex-shrink-0 w-12 h-12 bg-white p-1 rounded-lg">
                <div className="w-full h-full bg-black flex flex-wrap p-1">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className={`w-1/4 h-1/4 ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}></div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-300 font-medium">Scan to open on mobile</p>
                <p className="text-[10px] text-gray-500 italic leading-tight">Or tap "Add to Home Screen" in your browser menu.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
