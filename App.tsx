import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, OutfitStyle, ShotType, GeneratedShot, SHOT_TYPES } from './types';
import { generatePhotoshootImage } from './services/geminiService';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ChooseSceneSource from './components/ChooseSceneSource';
import CameraView from './components/CameraView';
import ChooseOutfitStyle from './components/ChooseOutfitStyle';
import Loader from './components/Loader';
import ResultView from './components/ResultView';
import CompareView from './components/CompareView';

const PortfolioView: React.FC<{ portfolio: GeneratedShot[], onBack: () => void, onRemove: (id: string) => void }> = ({ portfolio, onBack, onRemove }) => (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2">Your Portfolio</h2>
        <p className="text-gray-400 mb-8">Your collection of favorite shots.</p>
        {portfolio.length === 0 ? (
            <p>Your portfolio is empty. Create some images and save them!</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {portfolio.map((shot) => (
                    <div key={shot.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group relative">
                        <img src={shot.url} alt={shot.shotType} className="w-full h-auto aspect-[3/4] object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                            <h3 className="font-bold text-lg">{shot.shotType}</h3>
                            <p className="text-sm text-gray-300">{shot.style} Style</p>
                             <button onClick={() => onRemove(shot.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-500 flex items-center justify-center text-white">
                                &times;
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
        <button onClick={onBack} className="mt-12 py-3 px-8 text-lg font-bold rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
            Back to App
        </button>
    </div>
);


const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD_PORTRAIT);
  const [portraitImage, setPortraitImage] = useState<string | null>(null);
  const [sceneImage, setSceneImage] = useState<string | null>(null);
  const [generatedShots, setGeneratedShots] = useState<GeneratedShot[]>([]);
  const [portfolio, setPortfolio] = useState<GeneratedShot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastStep, setLastStep] = useState<AppStep>(AppStep.UPLOAD_PORTRAIT);

  useEffect(() => {
    try {
        const savedPortfolio = localStorage.getItem('aiDslrPortfolio');
        if (savedPortfolio) {
            setPortfolio(JSON.parse(savedPortfolio));
        }
    } catch (e) {
        console.error("Failed to load portfolio from localStorage", e);
    }
  }, []);

  const updatePortfolio = (newPortfolio: GeneratedShot[]) => {
      setPortfolio(newPortfolio);
      try {
          localStorage.setItem('aiDslrPortfolio', JSON.stringify(newPortfolio));
      } catch (e) {
          console.error("Failed to save portfolio to localStorage", e);
      }
  };

  const handlePortraitUpload = (base64: string) => {
    setPortraitImage(base64);
    setStep(AppStep.CHOOSE_SCENE_SOURCE);
  };
  
  const handleSceneUpload = (base64: string) => {
    setSceneImage(base64);
    setStep(AppStep.CHOOSE_OUTFIT);
  };

  const handleGenerate = useCallback(async (style: OutfitStyle, compareMode: boolean, customOutfitImage?: string | null) => {
    if (!portraitImage || !sceneImage) {
      setError("Portrait and scene images are required.");
      return;
    }
    setStep(AppStep.GENERATING);
    setError(null);
    setGeneratedShots([]);

    const stylesToGenerate = compareMode ? [OutfitStyle.CASUAL, OutfitStyle.FORMAL, OutfitStyle.ARTISTIC] : [style];
    
    try {
      const allShots: GeneratedShot[] = [];
      for (const currentStyle of stylesToGenerate) {
        for (const shotType of SHOT_TYPES) {
          const prompt = `Portrait in a ${sceneImage ? 'custom' : 'generic'} scene, ${currentStyle} style, ${shotType}.`;
          const resultUrl = await generatePhotoshootImage(portraitImage, sceneImage, currentStyle, shotType, customOutfitImage);
          allShots.push({
            id: `${Date.now()}-${currentStyle}-${shotType}`,
            url: resultUrl,
            prompt,
            style: currentStyle,
            shotType
          });
        }
      }
      setGeneratedShots(allShots);
      setStep(compareMode ? AppStep.COMPARE : AppStep.RESULTS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during image generation.";
      setError(errorMessage);
      setStep(AppStep.CHOOSE_OUTFIT); // Go back to the previous step on error
    }
  }, [portraitImage, sceneImage]);

  const handleStartOver = () => {
      setPortraitImage(null);
      setSceneImage(null);
      setGeneratedShots([]);
      setError(null);
      setStep(AppStep.UPLOAD_PORTRAIT);
  };

  const handleAddToPortfolio = (shot: GeneratedShot) => {
      if (!portfolio.some(pShot => pShot.id === shot.id)) {
          updatePortfolio([...portfolio, shot]);
      }
  };

  const handleRemoveFromPortfolio = (id: string) => {
      updatePortfolio(portfolio.filter(s => s.id !== id));
  }
  
  const handleViewPortfolio = () => {
    setLastStep(step);
    setStep(AppStep.PORTFOLIO);
  };

  const renderStep = () => {
    switch (step) {
      case AppStep.UPLOAD_PORTRAIT:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Step 1: Upload Your Portrait</h2>
            <p className="text-gray-400 mb-8">Choose a clear, forward-facing photo of yourself.</p>
            <ImageUploader
              onImageUpload={handlePortraitUpload}
              title="Upload a portrait"
              description="This image will be used to create your photos."
            />
          </div>
        );
      case AppStep.CHOOSE_SCENE_SOURCE:
        return (
            <ChooseSceneSource 
                onImageUpload={handleSceneUpload} 
                onCameraSelect={() => setStep(AppStep.USE_CAMERA)}
                onBack={() => setStep(AppStep.UPLOAD_PORTRAIT)}
            />
        );
      case AppStep.USE_CAMERA:
        return (
            <CameraView 
                onCapture={handleSceneUpload}
                onBack={() => setStep(AppStep.CHOOSE_SCENE_SOURCE)}
            />
        );
       case AppStep.CHOOSE_OUTFIT:
        return sceneImage && (
            <ChooseOutfitStyle 
                onGenerate={handleGenerate} 
                scenePreview={sceneImage}
                onBack={() => setStep(AppStep.CHOOSE_SCENE_SOURCE)}
            />
        );
      case AppStep.GENERATING:
        return <Loader />;
      case AppStep.RESULTS:
        return (
            <ResultView 
                shots={generatedShots} 
                onAddToPortfolio={handleAddToPortfolio} 
                onStartOver={handleStartOver}
                portfolio={portfolio}
            />
        );
      case AppStep.COMPARE:
        return (
            <CompareView 
                shots={generatedShots}
                onAddToPortfolio={handleAddToPortfolio}
                onStartOver={handleStartOver}
                portfolio={portfolio}
            />
        );
      case AppStep.PORTFOLIO:
        return <PortfolioView portfolio={portfolio} onBack={() => setStep(lastStep)} onRemove={handleRemoveFromPortfolio} />;
      default:
        return <p>Something went wrong.</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white font-sans">
        <Header onPortfolioClick={handleViewPortfolio} showPortfolioButton={portfolio.length > 0 && step !== AppStep.PORTFOLIO && step !== AppStep.UPLOAD_PORTRAIT} />
        <main className="flex-grow w-full flex flex-col items-center justify-center p-4 md:p-8">
            {error && step === AppStep.CHOOSE_OUTFIT && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6 max-w-xl text-center" role="alert">
                <strong className="font-bold">Generation Failed: </strong>
                <span className="block sm:inline">{error}</span>
                <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <svg className="fill-current h-6 w-6 text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </button>
              </div>
            )}
            {renderStep()}
        </main>
        <footer className="w-full text-center p-4 text-xs text-gray-500 border-t border-gray-800">
            Powered by Google Gemini.
        </footer>
    </div>
  );
};

export default App;