import React from 'react';
import { Settings, Home, CarIcon as AutofillIcon, FileText, User } from 'lucide-react';

const Popup: React.FC = () => {
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
        <h2 className="text-xl font-semibold mb-4">AI Job Assistant</h2>
        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Scan Page
        </button>
        {/* Add more content here as needed */}
      </main>

      {/* Footer */}
      <footer className="flex justify-around items-center p-4 bg-gray-100 border-t border-gray-200">
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors" aria-label="Home">
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors" aria-label="Autofill">
          <AutofillIcon size={24} />
          <span className="text-xs mt-1">Autofill</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors" aria-label="Resume">
          <FileText size={24} />
          <span className="text-xs mt-1">Resume</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors" aria-label="Profile">
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </footer>
    </div>
  );
};

export default Popup;

