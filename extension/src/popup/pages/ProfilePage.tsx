import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [jobHistory, setJobHistory] = useState([{ id: 1, company: '', position: '', startDate: '', endDate: '', description: '' }]);
  const [education, setEducation] = useState([{ id: 1, school: '', degree: '', fieldOfStudy: '', graduationDate: '' }]);
  const [projects, setProjects] = useState([{ id: 1, name: '', description: '', technologies: '' }]);

  const addItem = (setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    setter(prev => [...prev, { id: prev.length + 1 }]);
  };

  const removeItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, id: number) => {
    setter(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {/* Personal Information */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" id="fullName" name="fullName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input type="tel" id="phone" name="phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input type="text" id="location" name="location" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
        </div>
      </section>

      {/* Job History */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Job History</h3>
        {jobHistory.map((job, index) => (
          <div key={job.id} className="mb-4 p-4 border border-gray-200 rounded-md dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label htmlFor={`company-${job.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                <input type="text" id={`company-${job.id}`} name={`company-${job.id}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor={`position-${job.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                <input type="text" id={`position-${job.id}`} name={`position-${job.id}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor={`startDate-${job.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                  <input type="date" id={`startDate-${job.id}`} name={`startDate-${job.id}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="flex-1">
                  <label htmlFor={`endDate-${job.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                  <input type="date" id={`endDate-${job.id}`} name={`endDate-${job.id}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
              <div>
                <label htmlFor={`jobDescription-${job.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea id={`jobDescription-${job.id}`} name={`jobDescription-${job.id}`} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
              </div>
            </div>
            {index > 0 && (
              <button onClick={() => removeItem(setJobHistory, job.id)} className="mt-2 flex items-center text-red-600 hover:text-red-800">
                <Trash2 size={16} className="mr-1" />
                Remove
              </button>
            )}
          </div>
        ))}
        <button onClick={() => addItem(setJobHistory)} className="flex items-center text-blue-600 hover:text-blue-800">
          <Plus size={16} className="mr-1" />
          Add Job
        </button>
      </section>

      {/* Skills */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">List your skills (comma-separated)</label>
          <input type="text" id="skills" name="skills" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. JavaScript, React, Node.js" />
        </div>
      </section>

      {/* Projects */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Projects</h3>
        {projects.map((project, index) => (
          <div key={project.id} className="mb-4 p-4 border border-gray-200 rounded-md dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label htmlFor={`projectName-${project.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                <input type="text" id={`projectName-${project.id}`} name={`projectName-${project.id}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor={`projectDescription-${project.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea id={`projectDescription-${project.id}`} name={`projectDescription-${project.id}`} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
              </div>
              <div>
                <label htmlFor={`projectTechnologies-${project.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Technologies Used</label>
                <input type="text" id={`projectTechnologies-${project.id}`} name={`projectTechnologies-${project.id}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
            {index > 0 && (
              <button onClick={() => removeItem(setProjects, project.id)} className="mt-2 flex items-center text-red-600 hover:text-red-800">
                <Trash2 size={16} className="mr-1" />
                Remove
              </button>
            )}
          </div>
        ))}
        <button onClick={() => addItem(setProjects)} className="flex items-center text-blue-600 hover:text-blue-800">
          <Plus size={16} className="mr-1" />
          Add Project
        </button>
      </section>

      {/* Education */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Education</h3>
        {education.map((edu, index) => (
          <div key={edu.id} className="mb-4 p-4 border border-gray-200 rounded-md dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label htmlFor={`school-${edu.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">School</label>
                <input type="text" id={`school-${edu.id}`} name={`school-${edu.id}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor={`degree-${edu.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
                <input type="text" id={`degree-${edu.id}`} name={`degree-${edu.id}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor={`fieldOfStudy-${edu.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Field of Study</label>
                <input type="text" id={`fieldOfStudy-${edu.id}`} name={`fieldOfStudy-${edu.id}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor={`graduationDate-${edu.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Graduation Date</label>
                <input type="date" id={`graduationDate-${edu.id}`} name={`graduationDate-${edu.id}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
            {index > 0 && (
              <button onClick={() => removeItem(setEducation, edu.id)} className="mt-2 flex items-center text-red-600 hover:text-red-800">
                <Trash2 size={16} className="mr-1" />
                Remove
              </button>
            )}
          </div>
        ))}
        <button onClick={() => addItem(setEducation)} className="flex items-center text-blue-600 hover:text-blue-800">
          <Plus size={16} className="mr-1" />
          Add Education
        </button>
      </section>

      {/* Save Button */}
      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">
        Save Profile
      </button>
    </div>
  );
};

export default ProfilePage;
