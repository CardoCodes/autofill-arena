import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { cn } from "../../../lib/utils";

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
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input type="text" id="fullName" name="fullName" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input type="tel" id="phone" name="phone" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input type="text" id="location" name="location" />
          </div>
        </div>
      </section>

      {/* Job History */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Job History</h3>
        {jobHistory.map((job, index) => (
          <div key={job.id} className="mb-4 p-4 border rounded-md">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`company-${job.id}`}>Company</Label>
                <Input type="text" id={`company-${job.id}`} name={`company-${job.id}`} />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`position-${job.id}`}>Position</Label>
                <Input type="text" id={`position-${job.id}`} name={`position-${job.id}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor={`startDate-${job.id}`}>Start Date</Label>
                  <Input type="date" id={`startDate-${job.id}`} name={`startDate-${job.id}`} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor={`endDate-${job.id}`}>End Date</Label>
                  <Input type="date" id={`endDate-${job.id}`} name={`endDate-${job.id}`} />
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`jobDescription-${job.id}`}>Description</Label>
                <Textarea id={`jobDescription-${job.id}`} name={`jobDescription-${job.id}`} rows={3} />
              </div>
            </div>
            {index > 0 && (
              <Button 
                variant="ghost" 
                className="mt-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 h-auto" 
                onClick={() => removeItem(setJobHistory, job.id)}
              >
                <Trash2 size={16} className="mr-1" />
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button 
          variant="ghost" 
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 p-2 h-auto" 
          onClick={() => addItem(setJobHistory)}
        >
          <Plus size={16} className="mr-1" />
          Add Job
        </Button>
      </section>

      {/* Skills */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="skills">List your skills (comma-separated)</Label>
          <Input type="text" id="skills" name="skills" placeholder="e.g. JavaScript, React, Node.js" />
        </div>
      </section>

      {/* Projects */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Projects</h3>
        {projects.map((project, index) => (
          <div key={project.id} className="mb-4 p-4 border rounded-md">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`projectName-${project.id}`}>Project Name</Label>
                <Input type="text" id={`projectName-${project.id}`} name={`projectName-${project.id}`} />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`projectDescription-${project.id}`}>Description</Label>
                <Textarea id={`projectDescription-${project.id}`} name={`projectDescription-${project.id}`} rows={3} />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`projectTechnologies-${project.id}`}>Technologies Used</Label>
                <Input type="text" id={`projectTechnologies-${project.id}`} name={`projectTechnologies-${project.id}`} />
              </div>
            </div>
            {index > 0 && (
              <Button 
                variant="ghost" 
                className="mt-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 h-auto" 
                onClick={() => removeItem(setProjects, project.id)}
              >
                <Trash2 size={16} className="mr-1" />
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button 
          variant="ghost" 
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 p-2 h-auto" 
          onClick={() => addItem(setProjects)}
        >
          <Plus size={16} className="mr-1" />
          Add Project
        </Button>
      </section>

      {/* Education */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Education</h3>
        {education.map((edu, index) => (
          <div key={edu.id} className="mb-4 p-4 border rounded-md">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`school-${edu.id}`}>School</Label>
                <Input type="text" id={`school-${edu.id}`} name={`school-${edu.id}`} />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                <Input type="text" id={`degree-${edu.id}`} name={`degree-${edu.id}`} />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`fieldOfStudy-${edu.id}`}>Field of Study</Label>
                <Input type="text" id={`fieldOfStudy-${edu.id}`} name={`fieldOfStudy-${edu.id}`} />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={`graduationDate-${edu.id}`}>Graduation Date</Label>
                <Input type="date" id={`graduationDate-${edu.id}`} name={`graduationDate-${edu.id}`} />
              </div>
            </div>
            {index > 0 && (
              <Button 
                variant="ghost" 
                className="mt-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 h-auto" 
                onClick={() => removeItem(setEducation, edu.id)}
              >
                <Trash2 size={16} className="mr-1" />
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button 
          variant="ghost" 
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 p-2 h-auto" 
          onClick={() => addItem(setEducation)}
        >
          <Plus size={16} className="mr-1" />
          Add Education
        </Button>
      </section>

      {/* Save Button */}
      <Button className="w-full">
        Save Profile
      </Button>
    </div>
  );
};

export default ProfilePage;
