
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GenerationMode, VideoGenerationConfig, VideoFilter, OverlayLayer } from '../types';

interface ImageDisplayProps {
  isLoading: boolean;
  loadingMessage: string;
  generatedMedia: string | null;
  setGeneratedMedia: (url: string | null) => void;
  error: string | null;
  mode: GenerationMode;
  videoConfig?: VideoGenerationConfig;
}

interface EditState {
  brightness: number;
  saturation: number;
  contrast: number;
  exposure: number;
  highlights: number;
  shadows: number;
  blur: number;
  hueRotate: number;
  sepia: number;
  invert: number;
  grayscale: number;
  vignette: number;
  warmth: number;
  isCroppedToSquare: boolean;
  layers: OverlayLayer[];
}

const INITIAL_EDIT_STATE: EditState = { 
  brightness: 100, 
  saturation: 100, 
  contrast: 100,
  exposure: 0,
  highlights: 100,
  shadows: 100,
  blur: 0,
  hueRotate: 0,
  sepia: 0,
  invert: 0,
  grayscale: 0,
  vignette: 0,
  warmth: 0,
  isCroppedToSquare: false,
  layers: []
};

// Simple RTL detection for Urdu/Arabic script
const isRTL = (text: string) => {
  const rtlChars = /[\u0600-\u06FF]/;
  return rtlChars.test(text);
};

const EditToolbar: React.FC<{
  activeEdits: EditState;
  onEditChange: (newState: EditState) => void;
  onCommit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  onAddLayer: (type: 'text' | 'graphic') => void;
}> = ({ activeEdits, onEditChange, onCommit, onSave, onCancel, onReset, onAddLayer }) => {
  
  const SliderGroup = [
    {
      title: 'Lighting',
      items: [
        { label: 'Brightness', key: 'brightness', min: 0, max: 200, unit: '%' },
        { label: 'Contrast', key: 'contrast', min: 0, max: 200, unit: '%' },
        { label: 'Highlights', key: 'highlights', min: 0, max: 200, unit: '%' },
      ]
    },
    {
      title: 'Viral Effects',
      items: [
        { label: 'Saturation', key: 'saturation', min: 0, max: 300, unit: '%' },
        { label: 'Warmth', key: 'warmth', min: -100, max: 100, unit: '' },
        { label: 'Vignette', key: 'vignette', min: 0, max: 100, unit: '%' },
      ]
    }
  ] as const;

  return (
    <div className="w-full max-w-5xl bg-gray-800 p-4 rounded-2xl shadow-2xl border border-gray-700 animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
          {SliderGroup.map((group, idx) => (
            <div key={idx} className="space-y-3 bg-gray-900/40 p-3 rounded-xl border border-gray-700/50">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{group.title}</p>
              {group.items.map((s) => (
                <div key={s.key} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>{s.label}</span>
                    <span className="text-indigo-400">{(activeEdits as any)[s.key]}{s.unit}</span>
                  </div>
                  <input 
                    type="range" 
                    min={s.min} 
                    max={s.max} 
                    value={(activeEdits as any)[s.key]} 
                    onChange={(e) => onEditChange({ ...activeEdits, [s.key]: Number(e.target.value) })} 
                    onMouseUp={onCommit}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="w-full lg:w-48 space-y-3 bg-gray-900/60 p-3 rounded-xl border border-gray-700">
           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Add Layers</p>
           <button onClick={() => onAddLayer('text')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4v10a1 1 0 01-1-1V5zm11 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
              Add Big Text
           </button>
           <button onClick={() => onAddLayer('graphic')} className="w-full py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
              Growth Arrow
           </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
        <div className="flex gap-2">
            <button onClick={onReset} className="px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-white transition-colors">Reset Base</button>
            <button onClick={onCancel} className="px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-white transition-colors">Discard</button>
        </div>
        <button onClick={onSave} className="px-10 py-2.5 text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/20 transform transition-all hover:scale-105 active:scale-95">Save Final Thumbnail</button>
      </div>
    </div>
  );
};

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ isLoading, loadingMessage, generatedMedia, setGeneratedMedia, error, mode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeEdits, setActiveEdits] = useState<EditState>(INITIAL_EDIT_STATE);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleStartEditing = () => {
    setActiveEdits(INITIAL_EDIT_STATE);
    setIsEditing(true);
  };

  const handleAddLayer = (type: 'text' | 'graphic') => {
    const newLayer: OverlayLayer = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'text' ? 'VIRAL TEXT' : 'arrow',
      x: 50,
      y: 50,
      fontSize: 40,
      color: type === 'text' ? '#ffff00' : '#22c55e',
      rotation: 0
    };
    setActiveEdits(prev => ({ ...prev, layers: [...prev.layers, newLayer] }));
    setSelectedLayerId(newLayer.id);
  };

  const updateLayer = (id: string, updates: Partial<OverlayLayer>) => {
    setActiveEdits(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === id ? { ...l, ...updates } : l)
    }));
  };

  const handleLayerDrag = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setSelectedLayerId(id);
    const startX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const startY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
    
    const layer = activeEdits.layers.find(l => l.id === id);
    if (!layer) return;

    const initialX = layer.x;
    const initialY = layer.y;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = 'clientX' in moveEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
      const currentY = 'clientY' in moveEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;
      
      const deltaX = ((currentX - startX) / (containerRef.current?.offsetWidth || 1)) * 100;
      const deltaY = ((currentY - startY) / (containerRef.current?.offsetHeight || 1)) * 100;

      updateLayer(id, { x: initialX + deltaX, y: initialY + deltaY });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  };

  const handleSaveFinal = () => {
    if (!imageRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // 1. Draw Base with Filters
    ctx.filter = `brightness(${activeEdits.brightness}%) saturate(${activeEdits.saturation}%) contrast(${activeEdits.contrast}%)`;
    ctx.drawImage(img, 0, 0);

    // 2. Draw Layers
    activeEdits.layers.forEach(layer => {
      ctx.save();
      const x = (layer.x / 100) * canvas.width;
      const y = (layer.y / 100) * canvas.height;
      ctx.translate(x, y);
      
      if (layer.type === 'text') {
        const isUrdu = isRTL(layer.content);
        // Use Urdu font if needed
        const fontBase = isUrdu ? 'Noto Nastaliq Urdu, serif' : 'Arial Black, sans-serif';
        ctx.font = `bold ${ (layer.fontSize || 40) * (canvas.width / 800) }px ${fontBase}`;
        ctx.textAlign = 'center';
        
        if (isUrdu) {
            ctx.direction = 'rtl';
        }

        // Stroke
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 15;
        ctx.strokeText(layer.content, 0, 0);
        // Shadow glow
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 20;
        // Fill
        ctx.fillStyle = layer.color || 'yellow';
        ctx.fillText(layer.content, 0, 0);
      } else if (layer.type === 'graphic' && layer.content === 'arrow') {
        // Simple Growth Arrow Drawing
        ctx.beginPath();
        ctx.moveTo(-30, 30); ctx.lineTo(30, -30); ctx.lineTo(10, -30); ctx.moveTo(30, -30); ctx.lineTo(30, -10);
        ctx.strokeStyle = layer.color || 'green';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      ctx.restore();
    });

    setGeneratedMedia(canvas.toDataURL('image/jpeg', 0.95));
    setIsEditing(false);
  };

  const imageFilterStyle = {
    filter: `brightness(${activeEdits.brightness}%) saturate(${activeEdits.saturation}%) contrast(${activeEdits.contrast}%)`
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {isLoading ? (
        <div className="w-full aspect-video bg-gray-800 animate-pulse rounded-2xl flex flex-col items-center justify-center border border-gray-700">
           <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-white font-bold">{loadingMessage}</p>
        </div>
      ) : generatedMedia ? (
        <>
          <div ref={containerRef} className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group select-none bg-black">
            <img 
              ref={imageRef} 
              src={generatedMedia} 
              style={isEditing ? imageFilterStyle : {}} 
              className="w-full h-full object-cover" 
              alt="Art"
              crossOrigin="anonymous"
            />
            {isEditing && activeEdits.layers.map(layer => {
              const urdu = layer.type === 'text' && isRTL(layer.content);
              return (
              <div 
                key={layer.id}
                onMouseDown={(e) => handleLayerDrag(layer.id, e)}
                onTouchStart={(e) => handleLayerDrag(layer.id, e)}
                style={{ 
                  position: 'absolute', 
                  left: `${layer.x}%`, 
                  top: `${layer.y}%`, 
                  transform: 'translate(-50%, -50%)',
                  cursor: 'move',
                  zIndex: 20,
                  outline: selectedLayerId === layer.id ? '2px solid #6366f1' : 'none',
                  padding: '4px'
                }}
              >
                {layer.type === 'text' ? (
                  <div 
                    dir={urdu ? "rtl" : "ltr"}
                    className={urdu ? "font-urdu" : ""}
                    style={{ 
                    color: layer.color, 
                    fontSize: `${layer.fontSize}px`, 
                    fontWeight: '900', 
                    fontFamily: urdu ? "'Noto Nastaliq Urdu', serif" : "'Arial Black', sans-serif",
                    textShadow: '4px 4px 0px #000, 0 0 20px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap',
                    lineHeight: urdu ? '1.8' : 'normal'
                  }}>
                    {layer.content}
                  </div>
                ) : (
                  <div className="text-green-500 transform -rotate-45">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            )})}
          </div>

          {isEditing ? (
            <>
              {selectedLayerId && activeEdits.layers.find(l => l.id === selectedLayerId)?.type === 'text' && (
                <div className="w-full flex gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700">
                  <input 
                    type="text" 
                    dir="auto"
                    value={activeEdits.layers.find(l => l.id === selectedLayerId)?.content} 
                    onChange={(e) => updateLayer(selectedLayerId, { content: e.target.value })}
                    className="flex-grow bg-gray-900 text-white p-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none font-sans"
                    placeholder="Edit text... (Urdu supported)"
                  />
                  <input 
                    type="color" 
                    value={activeEdits.layers.find(l => l.id === selectedLayerId)?.color} 
                    onChange={(e) => updateLayer(selectedLayerId, { color: e.target.value })}
                    className="w-12 h-10 bg-transparent rounded cursor-pointer"
                  />
                  <input 
                    type="number" 
                    value={activeEdits.layers.find(l => l.id === selectedLayerId)?.fontSize} 
                    onChange={(e) => updateLayer(selectedLayerId, { fontSize: Number(e.target.value) })}
                    className="w-20 bg-gray-900 text-white p-2 rounded-lg border border-gray-600"
                  />
                </div>
              )}
              <EditToolbar 
                activeEdits={activeEdits} 
                onEditChange={setActiveEdits} 
                onCommit={() => {}} 
                onSave={handleSaveFinal} 
                onCancel={() => setIsEditing(false)} 
                onReset={() => setActiveEdits(INITIAL_EDIT_STATE)}
                onAddLayer={handleAddLayer}
              />
            </>
          ) : (
            <div className="flex gap-4">
              <button onClick={handleStartEditing} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                Enter Thumbnail Studio
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full aspect-video border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-500">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
           <p>Ready for your next masterpiece.</p>
        </div>
      )}
    </div>
  );
};
