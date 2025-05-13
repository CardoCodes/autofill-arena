import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Content: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'scanPage') {
        setIsVisible(true);
      }
    });
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded shadow-lg z-50">
      <h2 className="text-lg font-bold mb-2">AI Job Assistant</h2>
      <p>Analyzing job application...</p>
    </div>
  );
};

const root = document.createElement('div');
root.id = 'ai-job-assistant-root';
document.body.appendChild(root);

ReactDOM.render(<Content />, root);
