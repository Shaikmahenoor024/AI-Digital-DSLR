import React from 'react';
import { GeneratedShot } from '../types';

interface ResultViewProps {
  shots: GeneratedShot[];
  onAddToPortfolio: (shot: GeneratedShot) => void;
  onStartOver: () => void;
  portfolio: GeneratedShot[];
}

const ResultView: React.FC<ResultViewProps> = ({ shots, onAddToPortfolio, onStartOver, portfolio }) => {
  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const isInPortfolio = (shotId: string) => portfolio.some(pShot => pShot.id === shotId);

  const style = shots[0]?.style;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center px-4">
      <h2 className="text-3xl font-bold mb-2 text-center">Your Photoshoot is Ready!</h2>
      {style && <h3 className="text-xl font-semibold text-pink-400 mb-4">{style} Style</h3>}
      <p className="text-gray-400 mb-8 text-center">Here are your AI-generated shots. Save your favorites to your portfolio.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {shots.map((shot) => (
          <div key={shot.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group">
            <img src={shot.url} alt={shot.shotType} className="w-full h-auto aspect-[3/4] object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{shot.shotType}</h3>
              <div className="flex items-center space-x-2 mt-4">
                <button
                  onClick={() => downloadImage(shot.url, `ai_dslr_${shot.style}_${shot.shotType.replace(' ', '_')}.jpg`)}
                  className="flex-1 py-2 px-3 text-sm font-semibold rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => onAddToPortfolio(shot)}
                  disabled={isInPortfolio(shot.id)}
                  className="flex-1 py-2 px-3 text-sm font-semibold rounded-md bg-pink-600 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  {isInPortfolio(shot.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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