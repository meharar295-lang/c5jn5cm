
import React from 'react';
import { GenerationMode, VideoGenerationConfig, VideoStyle, VideoAspectRatio, ImageStyle, ImageQuality } from '../types';

interface GeneratorControlsProps {
  mode: GenerationMode;
  setMode: (mode: GenerationMode) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  videoConfig: VideoGenerationConfig;
  setVideoConfig: (config: VideoGenerationConfig) => void;
  imageStyle: ImageStyle;
  setImageStyle: (style: ImageStyle) => void;
  customImageStyle: string;
  setCustomImageStyle: (style: string) => void;
  imageQuality: ImageQuality;
  setImageQuality: (quality: ImageQuality) => void;
}

const ModeButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {icon}
    {label}
  </button>
);

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  mode,
  setMode,
  prompt,
  setPrompt,
  handleGenerate,
  isLoading,
  videoConfig,
  setVideoConfig,
  imageStyle,
  setImageStyle,
  customImageStyle,
  setCustomImageStyle,
  imageQuality,
  setImageQuality,
}) => {
  const getPlaceholder = () => {
    switch(mode) {
      case GenerationMode.THUMBNAIL:
        return 'Describe your thumbnail idea... (Urdu supported!)\ne.g., "یوٹیوب پر کامیاب ہونے کے 5 طریقے"';
      case GenerationMode.CARTOON:
        return 'e.g., "A cute astronaut cat floating in space"';
      case GenerationMode.VIDEO:
        return 'e.g., "A robot cat driving a car"';
      case GenerationMode.STORY_IMAGE:
        return 'Write your story here...\n\nExample:\nIn a forest of glowing mushrooms...';
      case GenerationMode.SOCIAL:
        return 'Enter text for your post. Urdu writing is perfectly supported!';
      case GenerationMode.VERTICAL_STORY:
        return 'Enter text for your story. (Example: "آج کی بات")';
      default:
        return '';
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl space-y-6 sticky top-8">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">1. Choose Content Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <ModeButton
            label="Thumbnail"
            isActive={mode === GenerationMode.THUMBNAIL}
            onClick={() => setMode(GenerationMode.THUMBNAIL)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
            }
          />
          <ModeButton
            label="Cartoon"
            isActive={mode === GenerationMode.CARTOON}
            onClick={() => setMode(GenerationMode.CARTOON)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            }
          />
          <ModeButton
            label="Video"
            isActive={mode === GenerationMode.VIDEO}
            onClick={() => setMode(GenerationMode.VIDEO)}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            }
          />
           <ModeButton
            label="Story Image"
            isActive={mode === GenerationMode.STORY_IMAGE}
            onClick={() => setMode(GenerationMode.STORY_IMAGE)}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 15c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 15c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" /></svg>
            }
          />
          <ModeButton
            label="Social Post"
            isActive={mode === GenerationMode.SOCIAL}
            onClick={() => setMode(GenerationMode.SOCIAL)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 012 2H6a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12h10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16h5" />
              </svg>
            }
          />
          <ModeButton
            label="Vertical Story"
            isActive={mode === GenerationMode.VERTICAL_STORY}
            onClick={() => setMode(GenerationMode.VERTICAL_STORY)}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            }
          />
        </div>
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          2. Describe Your Content (Supports Urdu)
        </label>
        <textarea
          id="prompt"
          dir="auto"
          rows={mode === GenerationMode.STORY_IMAGE ? 10 : mode === GenerationMode.SOCIAL || mode === GenerationMode.VERTICAL_STORY ? 7 : 5}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition font-sans"
          placeholder={getPlaceholder()}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      {mode === GenerationMode.VIDEO && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">3. Video Options</label>
          <div className="space-y-4 bg-gray-700/50 p-4 rounded-lg">
            <div>
              <label htmlFor="duration" className="flex justify-between text-xs font-medium text-gray-400">
                <span>Duration</span>
                <span>{videoConfig.duration}s</span>
              </label>
              <input 
                type="range" 
                id="duration" 
                min="2" 
                max="15" 
                value={videoConfig.duration} 
                onChange={e => setVideoConfig({ ...videoConfig, duration: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="style" className="block text-xs font-medium text-gray-400 mb-1">Animation Style</label>
              <select 
                id="style" 
                value={videoConfig.style} 
                onChange={e => setVideoConfig({ ...videoConfig, style: e.target.value as VideoStyle })}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                {Object.values(VideoStyle).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {(['16:9', '9:16', '1:1'] as VideoAspectRatio[]).map(ratio => (
                  <button 
                    key={ratio}
                    onClick={() => setVideoConfig({ ...videoConfig, aspectRatio: ratio })}
                    className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                      videoConfig.aspectRatio === ratio 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {mode !== GenerationMode.VIDEO && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">3. Image Options</label>
          <div className="space-y-4 bg-gray-700/50 p-4 rounded-lg">
            <div>
              <label htmlFor="imageStyle" className="block text-xs font-medium text-gray-400 mb-1">Image Style</label>
              <select 
                id="imageStyle" 
                value={imageStyle} 
                onChange={e => {
                  const newStyle = e.target.value as ImageStyle;
                  setImageStyle(newStyle);
                  if (newStyle !== ImageStyle.CUSTOM) {
                    setCustomImageStyle('');
                  }
                }}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                {Object.values(ImageStyle).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div>
              <label htmlFor="imageQuality" className="block text-xs font-medium text-gray-400 mb-1">Resolution Quality</label>
              <select 
                id="imageQuality" 
                value={imageQuality} 
                onChange={e => setImageQuality(e.target.value as ImageQuality)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                {Object.values(ImageQuality).map(q => <option key={q} value={q}>{q}</option>)}
              </select>
              {imageQuality !== ImageQuality.STANDARD && (
                <p className="text-[10px] text-indigo-300 mt-1 italic">Note: High Quality requires your own API key with billing enabled.</p>
              )}
            </div>

            {imageStyle === ImageStyle.CUSTOM && (
              <div>
                <label htmlFor="customImageStyle" className="block text-xs font-medium text-gray-400 mb-1">Custom Style Prompt</label>
                <input 
                  type="text"
                  id="customImageStyle"
                  value={customImageStyle}
                  onChange={e => setCustomImageStyle(e.target.value)}
                  placeholder="e.g., 'Van Gogh inspired, oil painting'"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          '✨ Generate'
        )}
      </button>
    </div>
  );
};
