import React, { useState, useEffect } from 'react';
import { GeneratedShot } from '../types';
import ImageViewer from './ImageViewer';

interface ResultViewProps {
  shots: GeneratedShot[];
  onAddToPortfolio: (shot: GeneratedShot) => void;
  onStartOver: () => void;
  portfolio: GeneratedShot[];
}

const ResultView: React.FC<ResultViewProps> = ({ shots, onAddToPortfolio, onStartOver, portfolio }) => {
  const [selectedShot, setSelectedShot] = useState<GeneratedShot | null>(null);

  useEffect(() => {
    if (shots.length > 0) {
      setSelectedShot(shots[0]);
    }
  }, [shots]);

  const downloadImage = (shot: GeneratedShot) => {
    const link = document.createElement('a');
    link.href = shot.url;
    link.download = `ai_dslr_${shot.style}_${shot.shotType.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (shot: GeneratedShot) => {
    try {
      const response = await fetch(shot.url);
      const blob = await response.blob();
      const file = new File([blob], `ai_dslr_${shot.style}_${shot.shotType.replace(/\s+/g, '_')}.jpg`, { type: blob.type });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'AI Photoshoot Image',
          text: 'Check out this image I created with AI Digital DSLR!',
          files: [file],
        });
      } else {
        alert("Sharing is not supported on this browser. Try downloading the image instead.");
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      alert('Could not share image. Please try downloading it instead.');
    }
  };

  const isInPortfolio = (shotId: string) => portfolio.some(pShot => pShot.id === shotId);

  const style = shots[0]?.style;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4">
      <h2 className="text-3xl font-bold mb-2 text-center">Your Photoshoot is Ready!</h2>
      {style && <h3 className="text-xl font-semibold text-pink-400 mb-4">{style} Style</h3>}
      <p className="text-gray-400 mb-6 text-center">Select a shot to view, zoom, or save to your portfolio.</p>

      <div className="w-full flex justify-center items-center gap-4 mb-4 flex-wrap">
        {shots.map((shot) => (
          <button
            key={shot.id}
            onClick={() => setSelectedShot(shot)}
            className={`rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedShot?.id === shot.id ? 'border-pink-500 scale-105' : 'border-transparent hover:border-gray-500'}`}
          >
            <img 
              src={shot.url} 
              alt={shot.shotType} 
              className="w-20 md:w-24 h-28 md:h-32 object-cover" 
            />
            <span className="block text-xs font-semibold p-1 bg-gray-800 truncate">{shot.shotType}</span>
          </button>
        ))}
      </div>

      {selectedShot && (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center mt-4">
          <ImageViewer key={selectedShot.id} src={selectedShot.url} alt={selectedShot.shotType} />
          <div className="grid grid-cols-3 gap-3 mt-4 w-full">
            <button
              onClick={() => downloadImage(selectedShot)}
              className="flex-1 py-2 px-3 text-sm font-semibold rounded-md bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              Download
            </button>
            <button
              onClick={() => handleShare(selectedShot)}
              className="flex-1 py-2 px-3 text-sm font-semibold rounded-md bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              Share
            </button>
            <button
              onClick={() => onAddToPortfolio(selectedShot)}
              disabled={isInPortfolio(selectedShot.id)}
              className="flex-1 py-2 px-3 text-sm font-semibold rounded-md bg-pink-600 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isInPortfolio(selectedShot.id) ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onStartOver}
        className="mt-12 py-3 px-8 text-lg font-bold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity"
      >
        Create Another
      </button>
    </div>
  );
};

export default ResultView;
