import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface JobDetails {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string;
}

interface JobDetailsPageProps {
  jobId: string;
  onBack: () => void;
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ jobId, onBack }) => {
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockJob: JobDetails = {
        id: jobId,
        title: 'Software Engineer',
        company: 'TechCorp Inc.',
        location: 'New York, NY',
        description: 'We are seeking a talented Software Engineer to join our dynamic team...',
        requirements: [
          '5+ years of experience in software development',
          'Proficiency in React and Node.js',
          'Strong problem-solving skills',
          'Excellent communication skills',
        ],
        salary: '$100,000 - $150,000',
      };

      setJob(mockJob);
      setLoading(false);
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back to listings
      </button>
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
      <p className="text-md text-gray-500 dark:text-gray-400 mb-4">{job.location}</p>
      <p className="text-lg font-semibold mb-2">Salary Range</p>
      <p className="mb-4">{job.salary}</p>
      <p className="text-lg font-semibold mb-2">Job Description</p>
      <p className="mb-4">{job.description}</p>
      <p className="text-lg font-semibold mb-2">Requirements</p>
      <ul className="list-disc pl-5 mb-4">
        {job.requirements.map((req, index) => (
          <li key={index} className="mb-1">{req}</li>
        ))}
      </ul>
      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">
        Apply Now
      </button>
    </div>
  );
};

export default JobDetailsPage;
