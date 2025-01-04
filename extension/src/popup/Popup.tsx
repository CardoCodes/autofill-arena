import React, { useState } from 'react';
import { Settings, Home, CarIcon as AutofillIcon, Sparkles, User } from 'lucide-react';
import HomePage from './pages/HomePage';
import AutofillPage from './pages/AutofillPage';
import AiPage from './pages/AiPage';
import ProfilePage from './pages/ProfilePage';

type Page = 'home' | 'autofill' | 'ai' | 'profile';

const Popup: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'autofill':
        return <AutofillPage />;
      case 'ai':
        return <AiPage />;
      case 'profile':
        return <ProfilePage />;
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-[400px]">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">MiddleAI</h1>
        <button className="p-2 rounded-full hover:bg-blue-700 transition-colors" aria-label="Settings">
          <Settings size={24} />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-grow p-4 overflow-y-auto">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="flex justify-around items-center p-4 bg-gray-100 border-t border-gray-200">
        <button
          className={`flex flex-col items-center ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage('home')}
          aria-label="Home"
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          className={`flex flex-col items-center ${currentPage === 'autofill' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage('autofill')}
          aria-label="Autofill"
        >
          <AutofillIcon size={24} />
          <span className="text-xs mt-1">Autofill</span>
        </button>
        <button
          className={`flex flex-col items-center ${currentPage === 'ai' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage('ai')}
          aria-label="AI"
        >
          <Sparkles size={24} />
          <span className="text-xs mt-1">AI</span>
        </button>
        <button
          className={`flex flex-col items-center ${currentPage === 'profile' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage('profile')}
          aria-label="Profile"
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </footer>
    </div>
  );
};

export default Popup;

