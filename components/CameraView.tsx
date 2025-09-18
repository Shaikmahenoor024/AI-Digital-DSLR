
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  onBack: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check permissions and try again.");
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Capture a Scene</h2>
      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        {error ? (
          <div className="w-full h-full flex items-center justify-center p-4 text-center text-red-400">{error}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        )}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
      <div className="flex items-center space-x-4 mt-6">
        <button onClick={onBack} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">Back</button>
        <button
          onClick={handleCapture}
          disabled={!stream}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center disabled:opacity-50 group"
        >
          <div className="w-16 h-16 rounded-full bg-white border-4 border-pink-500 group-hover:border-purple-500 transition-colors"></div>
        </button>
      </div>
    </div>
  );
};

export default CameraView;
