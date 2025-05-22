import React from 'react';
import './index.css'; // Import the CSS styles
import '../styles/globals.css'; // Import the global CSS
import Popup from './popup/Popup';
import { ThemeProvider } from '../components/theme-provider';

const App: React.FC = () => {
  return (
    <div className="w-full h-full">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Popup />
      </ThemeProvider>
    </div>
  );
};

export default App;
