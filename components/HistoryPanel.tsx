import React from 'react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onRegenerate: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const HistoryItemCard: React.FC<{
  item: HistoryItem;
  onSelect: (item: HistoryItem) => void;
  onRegenerate: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}> = ({ item, onSelect, onRegenerate, onDelete }) => {

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.imageDataUrl;
    link.download = `ai-art-${item.id}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-700/50 rounded-lg p-2 flex flex-col gap-2 group relative cursor-pointer" onClick={() => onSelect(item)}>
      <img 
        src={item.imageDataUrl} 
        alt={item.prompt} 
        className="w-full aspect-video object-cover rounded-md"
      />
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col p-2 justify-between">
         <p className="text-xs text-gray-200 line-clamp-3 overflow-hidden">{item.prompt}</p>
          <div className="flex justify-end gap-1.5">
            <button title="Regenerate" onClick={(e) => { e.stopPropagation(); onRegenerate(item); }} className="p-2 bg-gray-600/80 rounded-full text-white hover:bg-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 11a8.1 8.1 0 00-15.5 5.5m-2.5-5.5H16v-5" />
                </svg>
            </button>
            <button title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="p-2 bg-gray-600/80 rounded-full text-white hover:bg-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
         </div>
      </div>
    </div>
  );
};


export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onRegenerate, onDelete, onClear }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-2xl h-[85vh] flex flex-col sticky top-8">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-white">History</h2>
        {history.length > 0 && (
          <button onClick={onClear} className="text-sm text-red-400 hover:text-red-300 font-semibold transition-colors">Clear All</button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 pt-16 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Your generated images will appear here.</p>
          </div>
        ) : (
          history.map(item => (
            <HistoryItemCard 
              key={item.id}
              item={item}
              onSelect={onSelect}
              onRegenerate={onRegenerate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
