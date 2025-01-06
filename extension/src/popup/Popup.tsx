import React, { useState, useEffect } from 'react';
import { Settings, Home, CarIcon as AutofillIcon, Sparkles, User, Sun, Moon } from 'lucide-react';
import HomePage from './pages/HomePage';
import AutofillPage from './pages/AutofillPage';
import AIPage from './pages/AIPage';
import ProfilePage from './pages/ProfilePage';
import JobDetailsPage from './pages/JobDetailsPage';

type Page = 'home' | 'autofill' | 'ai' | 'profile' | 'job-details';

const Popup: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onSelectJob={(jobId) => {
          setSelectedJobId(jobId);
          setCurrentPage('job-details');
        }} />;
      case 'autofill':
        return <AutofillPage />;
      case 'ai':
        return <AIPage />;
      case 'profile':
        return <ProfilePage />;
      case 'job-details':
        return selectedJobId ? (
          <JobDetailsPage 
            jobId={selectedJobId} 
            onBack={() => setCurrentPage('home')} 
          />
        ) : null;
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex flex-col h-[600px] w-[400px]">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-blue-600 dark:bg-blue-800 text-white transition-colors duration-300">
        <h1 className="text-2xl font-bold">MiddleAI</h1>
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors duration-300"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun size={24} className="transition-transform duration-300 rotate-0" />
            ) : (
              <Moon size={24} className="transition-transform duration-300 rotate-180" />
            )}
          </button>
          <button className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors duration-300" aria-label="Settings">
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-4 overflow-y-auto bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-300">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="flex justify-around items-center p-4 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 transition-colors duration-300">
        <button
          className={`flex flex-col items-center ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage('home')}
          aria-label="Home"
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          className={`flex flex-col items-center ${currentPage === 'autofill' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage('autofill')}
          aria-label="Autofill"
        >
          <AutofillIcon size={24} />
          <span className="text-xs mt-1">Autofill</span>
        </button>
        <button
          className={`flex flex-col items-center ${currentPage === 'ai' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 transition-colors`}
          onClick={() => setCurrentPage('ai')}
          aria-label="AI"
        >
          <Sparkles size={24} />
          <span className="text-xs mt-1">AI</span>
        </button>
        <button
          className={`flex flex-col items-center ${currentPage === 'profile' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-600 transition-colors`}
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

