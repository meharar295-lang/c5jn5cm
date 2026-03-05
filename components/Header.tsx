
import React from 'react';

interface HeaderProps {
  onOpenApiKey?: () => void;
  hasApiKey?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenApiKey, hasApiKey }) => {
  return (
    <header className="relative text-center py-8 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-indigo-500/10 blur-[100px] -z-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 flex flex-col items-center relative">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 tracking-tight">
          AI Studio Pro
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto text-sm md:text-base font-medium">
          The all-in-one studio for professional thumbnails, cartoon art, and cinematic video.
        </p>
      </div>
    </header>
  );
};
