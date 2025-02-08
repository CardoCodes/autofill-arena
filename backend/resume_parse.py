import re
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Optional
from pdfminer.high_level import extract_text

@dataclass
class Job:
    title: str
    company: str
    dates: str
    description: List[str] = field(default_factory=list)

@dataclass
class Education:
    degree: str
    institution: str
    dates: str

@dataclass
class Resume:
    name: str = ""
    email: str = ""
    phone: str = ""
    education: List[Education] = field(default_factory=list)
    work_experience: List[Job] = field(default_factory=list)
    skills: List[str] = field(default_factory=list)
    projects: List[str] = field(default_factory=list)
    links: List[str] = field(default_factory=list)

class ResumeParser:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.raw_text = ""
        self.resume = Resume()
    
    def extract_text(self) -> None:
        """Extract text from PDF using pdfminer"""
        try:
            self.raw_text = extract_text(self.pdf_path)
        except Exception as e:
            raise RuntimeError(f"Error reading PDF: {str(e)}")

    def parse(self) -> Resume:
        """Parse raw text into structured Resume object"""
        if not self.raw_text:
            self.extract_text()

        lines = self.raw_text.split('\n')
        current_section = None

        for line in lines:
            # Detect section headers
            if self._is_section_header(line):
                current_section = line.strip().lower()
                continue

            # Process content based on current section
            if current_section:
                self._process_line(line, current_section)

        return self.resume

    def _is_section_header(self, line: str) -> bool:
        """Identify section headers using common resume section titles"""
        section_headers = {
            'contact', 'education', 'experience', 
            'work experience', 'skills', 'projects',
            'technical skills', 'links', 'certifications'
        }
        return any(re.match(fr'^{re.escape(header)}[\s:]?$', line, re.I) 
                   for header in section_headers)

    def _process_line(self, line: str, current_section: str) -> None:
        """Process lines based on current section"""
        line = line.strip()
        if not line:
            return

        section = current_section.replace(' ', '_')
        processor = getattr(self, f'_process_{section}', None)
        if processor:
            processor(line)
        else:
            self._process_general(line, current_section)

    def _process_contact(self, line: str) -> None:
        """Extract contact information"""
        if not self.resume.name:
            self.resume.name = line.title()
        else:
            if '@' in line:
                self.resume.email = line
            elif any(char.isdigit() for char in line):
                self.resume.phone = line
            else:
                self.resume.links.append(line)

    def _process_education(self, line: str) -> None:
        """Parse education section"""
        if not self.resume.education or '•' in line:
            # Assume new education entry starts with bullet point
            self.resume.education.append(Education("", "", ""))
            return
        
        # Extract dates using common patterns
        date_match = re.search(r'(\d{4}[-–]\d{4}|[A-Za-z]+\s\d{4}\s?[-–]\s?[A-Za-z]+\s\d{4})', line)
        if date_match:
            self.resume.education[-1].dates = date_match.group(0)
            line = line.replace(date_match.group(0), '')
        
        if not self.resume.education[-1].degree:
            self.resume.education[-1].degree = line.strip()
        else:
            self.resume.education[-1].institution = line.strip()

    def _process_experience(self, line: str) -> None:
        """Parse work experience section"""
        # Job title pattern: "Software Engineer | Company Name | Jun 2020 - Present"
        exp_match = re.match(r'(.+?)\s*[|•-]\s*(.+?)\s*[|•-]\s*(.+)', line)
        if exp_match:
            self.resume.work_experience.append(Job(
                title=exp_match.group(1).strip(),
                company=exp_match.group(2).strip(),
                dates=exp_match.group(3).strip()
            ))
        elif self.resume.work_experience and line.startswith('• '):
            self.resume.work_experience[-1].description.append(line[2:].strip())

    def _process_skills(self, line: str) -> None:
        """Parse skills section"""
        skills = re.split(r',\s*|\s*•\s*', line)
        self.resume.skills.extend([s.strip() for s in skills if s.strip()])

    def _process_projects(self, line: str) -> None:
        """Parse projects section"""
        if line.startswith('• '):
            self.resume.projects.append(line[2:].strip())

    def _process_links(self, line: str) -> None:
        """Parse links section"""
        if 'http' in line:
            self.resume.links.append(line.strip())

    def _process_general(self, line: str, section: str) -> None:
        """Fallback processor for unhandled sections"""
        pass

def main():
    # Example usage
    pdf_path = Path("data/resume.pdf")
    
    try:
        parser = ResumeParser(pdf_path)
        resume = parser.parse()
        
        print("=== Resume Data Extracted ===")
        print(f"Name: {resume.name}")
        print(f"Email: {resume.email}")
        print(f"Phone: {resume.phone}\n")
        
        print("Education:")
        for edu in resume.education:
            print(f"- {edu.degree} @ {edu.institution} ({edu.dates})")
            
        print("\nWork Experience:")
        for job in resume.work_experience:
            print(f"- {job.title} at {job.company} ({job.dates})")
            for desc in job.description:
                print(f"  • {desc}")
                
        print("\nSkills:")
        print(", ".join(resume.skills))
        
        print("\nProjects:")
        for project in resume.projects:
            print(f"- {project}")
            
        print("\nLinks:")
        for link in resume.links:
            print(f"- {link}")
            
    except Exception as e:
        print(f"Error processing resume: {str(e)}")

if __name__ == "__main__":
    main()