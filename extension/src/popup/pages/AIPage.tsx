import React, { useState } from 'react';
import { AI_MODES, aiModeButtonClasses, type AiMode } from '../constants/pages'

const AIPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<AiMode>('cover-letter');

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
      <div className="flex space-x-2 mb-4">
        {AI_MODES.map(mode => (
          <button key={mode.id} className={aiModeButtonClasses(selectedOption === mode.id)} onClick={() => setSelectedOption(mode.id)}>
            {mode.label}
          </button>
        ))}
      </div>
      <div className="border dark:border-gray-600 rounded p-3 dark:bg-gray-700">
        <textarea
          className="w-full h-32 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          placeholder={`Enter job description for ${selectedOption === 'cover-letter' ? 'cover letter' : selectedOption === 'resume' ? 'resume' : 'interview questions'} generation...`}
        ></textarea>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Generate
        </button>
      </div>
    </div>
  );
};

export default AIPage;
