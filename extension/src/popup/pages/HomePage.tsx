import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
}

interface HomePageProps {
  onSelectJob: (jobId: string) => void;
}

const jobs: Job[] = [
  { id: '1', title: 'Software Engineer', company: 'TechCorp Inc.', location: 'New York, NY' },
  { id: '2', title: 'Product Manager', company: 'InnovateCo', location: 'San Francisco, CA' },
  { id: '3', title: 'Data Scientist', company: 'DataDriven LLC', location: 'Boston, MA' },
];

const HomePage: React.FC<HomePageProps> = ({ onSelectJob }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
      <ul className="space-y-4">
        {jobs.map((job) => (
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
