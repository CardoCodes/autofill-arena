import React from 'react';

const AutofillPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Autofill Status</h2>
      <div className="space-y-4">
        <div className="border dark:border-gray-600 rounded p-3 dark:bg-gray-700">
          <h3 className="font-semibold">Software Engineer Application</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">TechCorp Inc.</p>
          <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full w-3/4"></div>
          </div>
          <p className="text-sm mt-1">75% Complete</p>
        </div>
        <div className="border dark:border-gray-600 rounded p-3 dark:bg-gray-700">
          <h3 className="font-semibold">Product Manager Application</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">InnovateCo</p>
          <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full w-1/2"></div>
          </div>
          <p className="text-sm mt-1">50% Complete</p>
        </div>
      </div>
    </div>
  );
};

export default AutofillPage;

