
import React, { useState, useEffect } from 'react';

const messages = [
    "Analyzing your scene's lighting...",
    "Selecting the perfect outfit...",
    "Calibrating AI camera lenses...",
    "Compositing your portrait...",
    "Adding artistic final touches...",
    "Rendering your high-resolution photoshoot..."
];

const Loader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-t-pink-500 border-gray-700 rounded-full animate-spin"></div>
                <div className="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 009.172 3H6.828a2 2 0 00-1.414.586L4.293 4.707A1 1 0 013.586 5H4zm10 6a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        <path d="M10 11a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-2xl font-bold mt-8">Generating your photoshoot...</h2>
            <p className="text-gray-400 mt-2 transition-opacity duration-500">
                {messages[messageIndex]}
            </p>
        </div>
    );
};

export default Loader;
