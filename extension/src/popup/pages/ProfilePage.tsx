import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [jobHistory, setJobHistory] = useState([{ company: '', position: '', startDate: '', endDate: '', description: '' }]);
  const [education, setEducation] = useState([{ institution: '', degree: '', fieldOfStudy: '', graduationDate: '' }]);
  const [projects, setProjects] = useState([{ name: '', description: '', technologies: '' }]);

  const addItem = (setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    setter(prev => [...prev, {}]);
  };

  const removeItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, index: number, field: string, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {/* Personal Information */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" id="fullName" name="fullName" className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" id="email" name="email" className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input type="tel" id="phone" name="phone" className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input type="text" id="location" name="location" className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" />
          </div>
        </div>
      </section>

      {/* Job History */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Job History</h3>
        {jobHistory.map((job, index) => (
          <div key={index} className="mb-4 p-4 border dark:border-gray-600 rounded-md">
            <div className="space-y-4">
              <div>
                <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                <input
                  type="text"
                  id={`company-${index}`}
                  value={job.company}
                  onChange={(e) => updateItem(setJobHistory, index, 'company', e.target.value)}
                  className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor={`position-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                <input
                  type="text"
                  id={`position-${index}`}
                  value={job.position}
                  onChange={(e) => updateItem(setJobHistory, index, 'position', e.target.value)}
                  className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                  <input
                    type="date"
                    id={`startDate-${index}`}
                    value={job.startDate}
                    onChange={(e) => updateItem(setJobHistory, index, 'startDate', e.target.value)}
                    className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                  <input
                    type="date"
                    id={`endDate-${index}`}
                    value={job.endDate}
                    onChange={(e) => updateItem(setJobHistory, index, 'endDate', e.target.value)}
                    className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
              <div>
                <label htmlFor={`jobDescription-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  id={`jobDescription-${index}`}
                  value={job.description}
                  onChange={(e) => updateItem(setJobHistory, index, 'description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                ></textarea>
              </div>
            </div>
            {index > 0 && (
              <button
                onClick={() => removeItem(setJobHistory, index)}
                className="mt-2 flex items-center text-red-600 hover:text-red-800"
              >
                <Minus size={16} className="mr-1" />
                Remove Job
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addItem(setJobHistory)}
          className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} className="mr-1" />
          Add Job
        </button>
      </section>

      {/* Skills */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Skills</h3>
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills (comma-separated)</label>
          <textarea
            id="skills"
            name="skills"
            rows={3}
            className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            placeholder="e.g. JavaScript, React, Node.js, Python"
          ></textarea>
        </div>
      </section>

      {/* Projects */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Projects</h3>
        {projects.map((project, index) => (
          <div key={index} className="mb-4 p-4 border dark:border-gray-600 rounded-md">
            <div className="space-y-4">
              <div>
                <label htmlFor={`projectName-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                <input
                  type="text"
                  id={`projectName-${index}`}
                  value={project.name}
                  onChange={(e) => updateItem(setProjects, index, 'name', e.target.value)}
                  className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor={`projectDescription-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  id={`projectDescription-${index}`}
                  value={project.description}
                  onChange={(e) => updateItem(setProjects, index, 'description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                ></textarea>
              </div>
              <div>
                <label htmlFor={`projectTechnologies-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Technologies Used</label>
                <input
                  type="text"
                  id={`projectTechnologies-${index}`}
                  value={project.technologies}
                  onChange={(e) => updateItem(setProjects, index, 'technologies', e.target.value)}
                  className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            {index > 0 && (
              <button
                onClick={() => removeItem(setProjects, index)}
                className="mt-2 flex items-center text-red-600 hover:text-red-800"
              >
                <Minus size={16} className="mr-1" />
                Remove Project
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addItem(setProjects)}
          className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} className="mr-1" />
          Add Project
        </button>
      </section>

      {/* Education */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Education</h3>
        {education.map((edu, index) => (
          <div key={index} className="mb-4 p-4 border dark:border-gray-600 rounded-md">
            <div className="space-y-4">
              <div>
                <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Institution</label>
                <input
                  type="text"
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => updateItem(setEducation, index, 'institution', e.target.value)}
                  className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
                <input
                  type="text"
                  id={`degree-${index}`}
                  value={edu.degree}
                  onChange={(e) => updateItem(setEducation, index, 'degree', e.target.value)}
                  className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor={`fieldOfStudy-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Field of Study</label>
                <input
                  type="text"
                  id={`fieldOfStudy-${index}`}
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateItem(setEducation, index, 'fieldOfStudy', e.target.value)}
                  className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor={`graduationDate-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Graduation Date</label>
                <input
                  type="date"
                  id={`graduationDate-${index}`}
                  value={edu.graduationDate}
                  onChange={(e) => updateItem(setEducation, index, 'graduationDate', e.target.value)}
                  className="mt-1 block w-full border dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            {index > 0 && (
              <button
                onClick={() => removeItem(setEducation, index)}
                className="mt-2 flex items-center text-red-600 hover:text-red-800"
              >
                <Minus size={16} className="mr-1" />
                Remove Education
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addItem(setEducation)}
          className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} className="mr-1" />
          Add Education
        </button>
      </section>

      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
        Save Profile
      </button>
    </div>
  );
};

export default ProfilePage;

