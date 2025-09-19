import React, { useState, useEffect } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt }) => {
  const [zoom, setZoom] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleZoom = (amount: number) => {
    setZoom(prev => Math.max(1, Math.min(5, prev + amount)));
  };

  const resetZoom = () => setZoom(1);

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
    resetZoom();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  const viewerControls = (
    <div className="absolute bottom-4 right-1/2 translate-x-1/2 z-10 flex items-center gap-2 bg-black/50 p-2 rounded-full">
      <button onClick={() => handleZoom(-0.2)} disabled={zoom <= 1} className="w-8 h-8 flex items-center justify-center bg-gray-700/80 rounded-full text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
      </button>
      <button onClick={() => handleZoom(0.2)} disabled={zoom >= 5} className="w-8 h-8 flex items-center justify-center bg-gray-700/80 rounded-full text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      </button>
    </div>
  );

  return (
    <>
      <div className="relative w-full aspect-[3/4] bg-gray-800 rounded-lg group overflow-hidden shadow-lg">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
          style={{ transform: `scale(${zoom})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {viewerControls}

        <button onClick={toggleFullScreen} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 1v-4m0 0h-4m4 0l-5 5" /></svg>
        </button>
      </div>

      {isFullScreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-fade-in">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-full h-full overflow-hidden flex items-center justify-center">
                <img
                    src={src}
                    alt={alt}
                    className="max-w-[95vw] max-h-[95vh] object-contain transition-transform duration-300 ease-in-out"
                    style={{ transform: `scale(${zoom})` }}
                />
            </div>

            {viewerControls}

            <button onClick={toggleFullScreen} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-black/70">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <style>{`.animate-fade-in { animation: fadeIn 0.3s ease; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
      )}
    </>
  );
};

export default ImageViewer;
