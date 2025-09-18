
import React from 'react';
import ImageUploader from './ImageUploader';

interface ChooseSceneSourceProps {
  onImageUpload: (base64Image: string) => void;
  onCameraSelect: () => void;
  onBack: () => void;
}

const ChooseSceneSource: React.FC<ChooseSceneSourceProps> = ({ onImageUpload, onCameraSelect, onBack }) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold mb-2">Step 2: Provide a Scene</h2>
      <p className="text-gray-400 mb-8">This will be the background for your photoshoot.</p>

      <ImageUploader 
        onImageUpload={onImageUpload}
        title="Upload a scene image"
        description="Choose a high-quality background for your photo."
      />

      <div className="my-8 flex items-center w-full max-w-lg">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="flex-shrink mx-4 text-gray-400">OR</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>
      
      <button
        onClick={onCameraSelect}
        className="w-full max-w-lg py-3 px-4 text-lg font-semibold rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Use your camera</span>
      </button>

      <button onClick={onBack} className="mt-8 text-gray-400 hover:text-white transition-colors">
        &larr; Back to portrait upload
      </button>
    </div>
  );
};

export default ChooseSceneSource;
