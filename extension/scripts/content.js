import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
const Content = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        // Listen for messages from the popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'scanPage') {
                setIsVisible(true);
            }
        });
    }, []);
    if (!isVisible)
        return null;
    return (React.createElement("div", { className: "fixed top-4 right-4 bg-white p-4 rounded shadow-lg z-50" },
        React.createElement("h2", { className: "text-lg font-bold mb-2" }, "AI Job Assistant"),
        React.createElement("p", null, "Analyzing job application...")));
};
const rootElement = document.createElement('div');
rootElement.id = 'ai-job-assistant-root';
document.body.appendChild(rootElement);
const root = createRoot(rootElement);
root.render(React.createElement(Content, null));
