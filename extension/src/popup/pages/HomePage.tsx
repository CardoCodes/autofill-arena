import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MOCK_JOBS, type Job } from '../constants/pages';

interface HomePageProps {
  onSelectJob: (jobId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectJob }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
      <ul className="space-y-4">
        {MOCK_JOBS.map((job) => (
          <li 
            key={job.id}
            className="border dark:border-gray-600 rounded p-3 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200"
            onClick={() => onSelectJob(job.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{job.company}</p>
                <p className="text-sm">{job.location}</p>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
