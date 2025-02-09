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
        
        # Expanded section header variations
        self.section_headers = {
            'experience': {
                'work experience', 'experience', 'employment history', 
                'professional experience', 'work history', 'career history',
                'relevant experience', 'professional background', 'career experience'
            },
            'education': {
                'education', 'educational background', 'academic background',
                'academic history', 'academics', 'qualifications'
            },
            'skills': {
                'skills', 'technical skills', 'core competencies',
                'competencies', 'expertise', 'proficiencies',
                'professional skills', 'key skills'
            },
            'projects': {
                'projects', 'personal projects', 'academic projects',
                'professional projects', 'key projects'
            },
            'contact': {
                'contact', 'contact information', 'personal information',
                'personal details'
            },
            'links': {
                'links', 'websites', 'social media', 'profiles',
                'online presence'
            }
        }

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
        section_content = []

        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            is_header, section_name = self._is_section_header(line)
            
            if is_header:
                # Process previous section before moving to new one
                if current_section and section_content:
                    self._process_section(current_section, section_content)
                current_section = section_name
                section_content = []
            else:
                section_content.append(line)

        # Process the last section
        if current_section and section_content:
            self._process_section(current_section, section_content)

        return self.resume

    def _is_section_header(self, line: str) -> tuple[bool, str]:
        """Improved section header detection with case insensitivity and common patterns"""
        cleaned = re.sub(r'[:•\-*\s]+', '', line.lower())
        
        for section, variations in self.section_headers.items():
            if any(v.replace(' ', '') in cleaned for v in variations):
                return True, section
                
        # Special case for contact info at top
        if not self.resume.name and any(w in cleaned for w in {'contact', 'personal'}):
            return True, 'contact'
            
        return False, ""

    def _process_section(self, section: str, content: List[str]) -> None:
        """Process a complete section of content"""
        processor = getattr(self, f'_process_{section}', None)
        if processor:
            processor(content)
        else:
            self._process_general(content, section)

    def _process_experience(self, content: List[str]) -> None:
        """Parse work experience section with improved detection"""
        current_job = None
        
        for line in content:
            # Try different job entry patterns
            job_patterns = [
                # Title | Company | Dates
                r'^(.+?)\s*[|•-]\s*(.+?)\s*[|•-]\s*(.+)$',
                # Title at Company, Dates
                r'^(.+?)\s+(?:at|@)\s+(.+?),\s*(.+)$',
                # Company - Title - Dates
                r'^(.+?)\s*[-–]\s*(.+?)\s*[-–]\s*(.+)$'
            ]
            
            matched = False
            for pattern in job_patterns:
                match = re.match(pattern, line)
                if match:
                    if current_job:
                        self.resume.work_experience.append(current_job)
                    current_job = Job(
                        title=match.group(1).strip(),
                        company=match.group(2).strip(),
                        dates=match.group(3).strip()
                    )
                    matched = True
                    break
            
            if not matched and current_job:
                # Handle bullet points and other description lines
                if line.startswith('•') or line.startswith('-'):
                    line = line.lstrip('•- ').strip()
                current_job.description.append(line)
                
        # Add the last job
        if current_job:
            self.resume.work_experience.append(current_job)

    def _process_contact(self, content: List[str]) -> None:
        """Extract contact information"""
        for line in content:
            if not self.resume.name:
                self.resume.name = line.title()
            else:
                if '@' in line:
                    self.resume.email = line
                elif any(char.isdigit() for char in line):
                    self.resume.phone = line
                else:
                    self.resume.links.append(line)

    def _process_education(self, content: List[str]) -> None:
        """Parse education section"""
        current_education = None
        
        for line in content:
            if '•' in line or not current_education:
                # Start new education entry
                current_education = Education("", "", "")
                self.resume.education.append(current_education)
                
            # Extract dates using common patterns
            date_match = re.search(r'(\d{4}[-–]\d{4}|[A-Za-z]+\s\d{4}\s?[-–]\s?[A-Za-z]+\s\d{4})', line)
            if date_match:
                current_education.dates = date_match.group(0)
                line = line.replace(date_match.group(0), '')
            
            if not current_education.degree:
                current_education.degree = line.strip()
            else:
                current_education.institution = line.strip()

    def _process_skills(self, content: List[str]) -> None:
        """Parse skills section"""
        for line in content:
            skills = re.split(r',\s*|\s*•\s*', line)
            self.resume.skills.extend([s.strip() for s in skills if s.strip()])

    def _process_projects(self, content: List[str]) -> None:
        """Parse projects section"""
        for line in content:
            if line.startswith('• '):
                self.resume.projects.append(line[2:].strip())
            else:
                self.resume.projects.append(line.strip())

    def _process_links(self, content: List[str]) -> None:
        """Parse links section"""
        for line in content:
            if 'http' in line:
                self.resume.links.append(line.strip())

    def _process_general(self, content: List[str], section: str) -> None:
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