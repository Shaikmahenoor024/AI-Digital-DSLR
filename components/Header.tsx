
import React from 'react';

interface HeaderProps {
    onPortfolioClick: () => void;
    showPortfolioButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onPortfolioClick, showPortfolioButton }) => {
    return (
        <header className="py-4 px-6 md:px-8 w-full flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 009.172 3H6.828a2 2 0 00-1.414.586L4.293 4.707A1 1 0 013.586 5H4zm10 6a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    <path d="M10 11a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    AI Digital DSLR
                </h1>
            </div>
             {showPortfolioButton && (
                <button
                    onClick={onPortfolioClick}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                    Portfolio
                </button>
            )}
        </header>
    );
};

export default Header;
