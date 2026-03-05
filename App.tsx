
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { GeneratorControls } from './components/GeneratorControls';
import { ImageDisplay } from './components/ImageDisplay';
import { Footer } from './components/Footer';
import { HistoryPanel } from './components/HistoryPanel';
import { GenerationMode, VideoGenerationConfig, VideoStyle, ImageStyle, HistoryItem, ImageQuality } from './types';
import { generateImage, generateVideo } from './services/geminiService';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.THUMBNAIL);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedMediaUrl, setGeneratedMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [videoConfig, setVideoConfig] = useState<VideoGenerationConfig>({
    duration: 4,
    style: VideoStyle.DEFAULT,
    aspectRatio: '16:9',
  });
  const [imageStyle, setImageStyle] = useState<ImageStyle>(ImageStyle.DEFAULT);
  const [customImageStyle, setCustomImageStyle] = useState<string>('');
  const [imageQuality, setImageQuality] = useState<ImageQuality>(ImageQuality.STANDARD);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    };
    checkKey();
  }, []);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('generationHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  const addToHistory = useCallback((newItem: HistoryItem) => {
    setHistory(prevHistory => {
      const updatedHistory = [newItem, ...prevHistory].slice(0, 50); // Keep max 50 items
      try {
        localStorage.setItem('generationHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
      return updatedHistory;
    });
  }, []);

  const handleOpenApiKey = async () => {
    await window.aistudio.openSelectKey();
    setHasApiKey(true); // Assume success per guidelines to mitigate race condition
  };

  const ensureApiKey = async () => {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await handleOpenApiKey();
      return true;
    }
    return true;
  };
  
  const handleApiError = async (e: any, customPrefix: string) => {
    console.error(e);
    let errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    
    const isPermissionError = 
      errorMessage.includes("403") || 
      errorMessage.toLowerCase().includes("permission denied") || 
      errorMessage.toLowerCase().includes("caller does not have permission") ||
      errorMessage.includes("Requested entity was not found");

    if (isPermissionError) {
        setHasApiKey(false);
        await handleOpenApiKey();
        setError("API permission error. Please ensure you've selected a valid API key from a paid project with necessary APIs enabled.");
    } else {
        setError(`${customPrefix}. Please check your prompt or try again later.`);
    }
  };

  const runImageGeneration = useCallback(async (
    genPrompt: string,
    genMode: GenerationMode,
    genImageStyle: ImageStyle,
    genCustomImageStyle: string,
    genQuality: ImageQuality
  ) => {
    if (!genPrompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    if (genQuality !== ImageQuality.STANDARD) {
      await ensureApiKey();
    }

    setIsLoading(true);
    setGeneratedMediaUrl(null);
    setError(null);
    setLoadingMessage(genMode === GenerationMode.STORY_IMAGE ? 'Visualizing your story...' : 'Generating your image...');

    try {
      const mediaUrl = await generateImage(genPrompt, genMode, genImageStyle, genCustomImageStyle, genQuality);
      setGeneratedMediaUrl(mediaUrl);
      const newItem: HistoryItem = {
        id: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        prompt: genPrompt,
        mode: genMode,
        imageStyle: genImageStyle,
        customImageStyle: genCustomImageStyle,
        imageDataUrl: mediaUrl,
        quality: genQuality,
      };
      addToHistory(newItem);
    } catch (e) {
      await handleApiError(e, `Failed to generate ${genMode.toLowerCase()}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [addToHistory]);

  const handleGenerate = useCallback(async () => {
    if (mode === GenerationMode.VIDEO) {
        if (!prompt.trim()) {
          setError('Please enter a prompt to generate content.');
          return;
        }
        await ensureApiKey();
        setIsLoading(true);
        setGeneratedMediaUrl(null);
        setError(null);
        setLoadingMessage('Initializing video generation...');
        try {
            const mediaUrl = await generateVideo(prompt, videoConfig, (status) => {
                setLoadingMessage(status);
            });
            setGeneratedMediaUrl(mediaUrl);
        } catch (e) {
            await handleApiError(e, "Failed to generate video");
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    } else {
        await runImageGeneration(prompt, mode, imageStyle, customImageStyle, imageQuality);
    }
  }, [prompt, mode, imageStyle, customImageStyle, imageQuality, videoConfig, runImageGeneration]);

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setGeneratedMediaUrl(item.imageDataUrl);
    setPrompt(item.prompt);
    setMode(item.mode);
    setImageStyle(item.imageStyle);
    setCustomImageStyle(item.customImageStyle);
    if (item.quality) setImageQuality(item.quality);
  };

  const handleRegenerateFromHistory = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setMode(item.mode);
    setImageStyle(item.imageStyle);
    setCustomImageStyle(item.customImageStyle);
    const quality = item.quality || ImageQuality.STANDARD;
    setImageQuality(quality);
    runImageGeneration(item.prompt, item.mode, item.imageStyle, item.customImageStyle, quality);
  };
  
  const handleDeleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('generationHistory', JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('generationHistory');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col relative overflow-x-hidden">
      <Header 
        onOpenApiKey={handleOpenApiKey}
        hasApiKey={hasApiKey}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4 lg:sticky top-8 self-start">
          <GeneratorControls
            mode={mode}
            setMode={setMode}
            prompt={prompt}
            setPrompt={setPrompt}
            handleGenerate={handleGenerate}
            isLoading={isLoading}
            videoConfig={videoConfig}
            setVideoConfig={setVideoConfig}
            imageStyle={imageStyle}
            setImageStyle={setImageStyle}
            customImageStyle={customImageStyle}
            setCustomImageStyle={setCustomImageStyle}
            imageQuality={imageQuality}
            setImageQuality={setImageQuality}
          />
        </div>
        <div className="lg:w-1/2">
          <ImageDisplay
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            generatedMedia={generatedMediaUrl}
            setGeneratedMedia={setGeneratedMediaUrl}
            error={error}
            mode={mode}
            videoConfig={mode === GenerationMode.VIDEO ? videoConfig : undefined}
          />
        </div>
        <div className="lg:w-1/4">
           <HistoryPanel
            history={history}
            onSelect={handleSelectHistoryItem}
            onRegenerate={handleRegenerateFromHistory}
            onDelete={handleDeleteHistoryItem}
            onClear={handleClearHistory}
           />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
