import React, { useState } from 'react';

const AIPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'cover-letter' | 'resume' | 'questions'>('cover-letter');

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${selectedOption === 'cover-letter' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedOption('cover-letter')}
        >
          Cover Letter
        </button>
        <button
          className={`px-3 py-1 rounded ${selectedOption === 'resume' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedOption('resume')}
        >
          Resume
        </button>
        <button
          className={`px-3 py-1 rounded ${selectedOption === 'questions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedOption('questions')}
        >
          Questions
        </button>
      </div>
      <div className="border rounded p-3">
        <textarea
          className="w-full h-32 p-2 border rounded"
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

