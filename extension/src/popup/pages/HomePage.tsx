import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
      <ul className="space-y-4">
        <li className="border rounded p-3">
          <h3 className="font-semibold">Software Engineer</h3>
          <p className="text-sm text-gray-600">TechCorp Inc.</p>
          <p className="text-sm">New York, NY</p>
        </li>
        <li className="border rounded p-3">
          <h3 className="font-semibold">Product Manager</h3>
          <p className="text-sm text-gray-600">InnovateCo</p>
          <p className="text-sm">San Francisco, CA</p>
        </li>
        <li className="border rounded p-3">
          <h3 className="font-semibold">Data Scientist</h3>
          <p className="text-sm text-gray-600">DataDriven LLC</p>
          <p className="text-sm">Boston, MA</p>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;

