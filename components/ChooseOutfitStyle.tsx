import React, { useState } from 'react';
import { OutfitStyle } from '../types';
import ImageUploader from './ImageUploader';

interface ChooseOutfitStyleProps {
  onGenerate: (style: OutfitStyle, compareMode: boolean, customOutfitImage?: string | null) => void;
  scenePreview: string;
  onBack: () => void;
}

const styles = [
  { style: OutfitStyle.CASUAL, name: 'Casual', icon: '👕' },
  { style: OutfitStyle.FORMAL, name: 'Formal', icon: '🤵' },
  { style: OutfitStyle.ARTISTIC, name: 'Artistic', icon: '🎨' },
  { style: OutfitStyle.CUSTOM, name: 'Custom', icon: '✨' },
];

const ChooseOutfitStyle: React.FC<ChooseOutfitStyleProps> = ({ onGenerate, scenePreview, onBack }) => {
  const [selectedStyle, setSelectedStyle] = useState<OutfitStyle | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [customOutfitImage, setCustomOutfitImage] = useState<string | null>(null);

  const handleGenerate = () => {
    if (selectedStyle || compareMode) {
      onGenerate(selectedStyle!, compareMode, customOutfitImage);
    }
  };
  
  const handleStyleSelect = (style: OutfitStyle) => {
    if (compareMode) return;
    setSelectedStyle(style);
    if (style !== OutfitStyle.CUSTOM) {
      setCustomOutfitImage(null);
    }
  };

  const handleCompareToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setCompareMode(isChecked);
    setSelectedStyle(null);
    setCustomOutfitImage(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold mb-2">Step 3: Choose Your Style</h2>
      <p className="text-gray-400 mb-8">Select a preset style or upload your own.</p>
      
      <div className="flex flex-col md:flex-row items-center gap-8 w-full">
        <div className="w-full md:w-1/2 flex-shrink-0">
            <p className="font-semibold mb-2">Your Scene</p>
            <img src={scenePreview} alt="Scene Preview" className="rounded-lg object-cover w-full aspect-video shadow-lg" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className={`grid grid-cols-1 gap-4 w-full mb-6`}>
                {styles.map(({ style, name, icon }) => (
                    <button
                        key={style}
                        onClick={() => handleStyleSelect(style)}
                        className={`p-4 rounded-lg border-2 transition-all text-left flex items-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                            selectedStyle === style && !compareMode
                            ? 'border-pink-500 bg-pink-500/10'
                            : 'border-gray-600 bg-gray-800 hover:border-pink-500'
                        }`}
                        disabled={compareMode}
                    >
                        <span className="text-3xl">{icon}</span>
                        <div>
                            <p className="font-bold text-lg">{name}</p>
                        </div>
                    </button>
                ))}
            </div>

            {selectedStyle === OutfitStyle.CUSTOM && !compareMode && (
                <div className="w-full mb-6">
                    <ImageUploader 
                        onImageUpload={setCustomOutfitImage}
                        title="Upload outfit image"
                        description="Provide a photo of the clothing."
                    />
                </div>
            )}

            <div className="relative flex items-center justify-center w-full mb-6">
                <input 
                    id="compare-toggle"
                    type="checkbox" 
                    className="hidden" 
                    checked={compareMode} 
                    onChange={handleCompareToggle}
                    disabled={selectedStyle === OutfitStyle.CUSTOM}
                />
                <label htmlFor="compare-toggle" className={`flex items-center cursor-pointer ${selectedStyle === OutfitStyle.CUSTOM ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="relative">
                        <div className={`w-14 h-8 rounded-full shadow-inner transition-colors ${compareMode ? 'bg-pink-600' : 'bg-gray-600'}`}></div>
                        <div className={`absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0 my-1 ml-1 transition-transform transform ${compareMode ? 'translate-x-full' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-white font-medium">Compare All Styles</div>
                </label>
            </div>

            <button
                onClick={handleGenerate}
                disabled={(!selectedStyle && !compareMode) || (selectedStyle === OutfitStyle.CUSTOM && !customOutfitImage)}
                className="w-full py-3 px-4 text-lg font-bold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
                Generate Photoshoot
            </button>
             <button onClick={onBack} className="mt-6 text-gray-400 hover:text-white transition-colors">
                &larr; Back to scene selection
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseOutfitStyle;