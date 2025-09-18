import React from 'react';
import { GeneratedShot, OutfitStyle, ShotType } from '../types';

interface CompareViewProps {
  shots: GeneratedShot[];
  onAddToPortfolio: (shot: GeneratedShot) => void;
  onStartOver: () => void;
  portfolio: GeneratedShot[];
}

const CompareView: React.FC<CompareViewProps> = ({ shots, onAddToPortfolio, onStartOver, portfolio }) => {
  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const isInPortfolio = (shotId: string) => portfolio.some(pShot => pShot.id === shotId);

  const getShot = (style: OutfitStyle, shotType: ShotType): GeneratedShot | undefined => {
      return shots.find(s => s.style === style && s.shotType === shotType);
  }

  const styles = [OutfitStyle.CASUAL, OutfitStyle.FORMAL, OutfitStyle.ARTISTIC];
  const shotTypes: ShotType[] = ['Closeup Shot', 'Medium Close-up Shot', 'Knees-Up Medium Wide Shot'];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center px-4">
      <h2 className="text-3xl font-bold mb-2 text-center">Compare Styles</h2>
      <p className="text-gray-400 mb-8 text-center">View your shots across all outfit styles.</p>

      <div className="w-full flex flex-col gap-12">
        {shotTypes.map(shotType => (
          <section key={shotType}>
            <h3 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">{shotType}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {styles.map(style => {
                const shot = getShot(style, shotType);
                return (
                  <div key={`${style}-${shotType}`} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group">
                    {shot ? (
                      <>
                        <img src={shot.url} alt={`${style} ${shotType}`} className="w-full h-auto aspect-[3/4] object-cover" />
                        <div className="p-4">
                          <h4 className="font-bold text-lg">{shot.style} Style</h4>
                          <div className="flex items-center space-x-2 mt-3">
                            <button
                              onClick={() => downloadImage(shot.url, `ai_dslr_${shot.style}_${shot.shotType.replace(' ', '_')}.jpg`)}
                              className="flex-1 py-2 px-2 text-sm font-semibold rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => onAddToPortfolio(shot)}
                              disabled={isInPortfolio(shot.id)}
                              className="flex-1 py-2 px-2 text-sm font-semibold rounded-md bg-pink-600 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                            >
                              {isInPortfolio(shot.id) ? 'Saved' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full aspect-[3/4] flex items-center justify-center bg-gray-700 rounded-lg">
                        <p className="text-gray-500">Not Generated</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
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

export default CompareView;