import re
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Optional
from pdfminer.high_level import extract_text
from transformers import AutoModelForCausalLM, AutoTokenizer
import json

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

class ResumeParserLLM:
    def __init__(self, pdf_path: str, model_name: str = "TheBloke/Mistral-7B-Instruct-v0.1-GGUF"):
        self.pdf_path = pdf_path
        self.raw_text = ""
        self.resume = Resume()
        
        # Initialize LLM and tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name, 
                                                        device_map="auto",
                                                        trust_remote_code=False,
                                                        revision="main")

    def extract_text(self) -> None:
        """Extract text from PDF using pdfminer"""
        try:
            self.raw_text = extract_text(self.pdf_path)
        except Exception as e:
            raise RuntimeError(f"Error reading PDF: {str(e)}")

    def generate_prompt(self) -> str:
        """Generate structured prompt for LLM"""
        return f"""Extract the following information from this resume in valid JSON format. 
        Include all available details. If a field isn't present, omit it.
        
        Required structure:
        {{
            "name": "str",
            "email": "str",
            "phone": "str",
            "education": [
                {{
                    "degree": "str",
                    "institution": "str",
                    "dates": "str"
                }}
            ],
            "work_experience": [
                {{
                    "title": "str",
                    "company": "str",
                    "dates": "str",
                    "description": ["str"]
                }}
            ],
            "skills": ["str"],
            "projects": ["str"],
            "links": ["str"]
        }}
        
        Resume text:
        {self.raw_text[:3000]}  # Truncate to fit context window
        """

    def parse_with_llm(self) -> dict:
        """Process text through LLM to extract structured data"""
        prompt = self.generate_prompt()
        
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        outputs = self.model.generate(**inputs, max_new_tokens=1000)
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract JSON from response
        try:
            json_str = re.search(r'\{.*\}', response, re.DOTALL).group()
            return json.loads(json_str)
        except (AttributeError, json.JSONDecodeError) as e:
            raise ValueError(f"Failed to parse LLM response: {str(e)}")

    def parse(self) -> Resume:
        """Main parsing workflow"""
        if not self.raw_text:
            self.extract_text()
            
        llm_data = self.parse_with_llm()
        
        # Map LLM output to Resume object
        self.resume.name = llm_data.get("name", "")
        self.resume.email = llm_data.get("email", "")
        self.resume.phone = llm_data.get("phone", "")
        
        # Process education
        for edu in llm_data.get("education", []):
            self.resume.education.append(Education(
                degree=edu.get("degree", ""),
                institution=edu.get("institution", ""),
                dates=edu.get("dates", "")
            ))
            
        # Process work experience
        for job in llm_data.get("work_experience", []):
            self.resume.work_experience.append(Job(
                title=job.get("title", ""),
                company=job.get("company", ""),
                dates=job.get("dates", ""),
                description=job.get("description", [])
            ))
            
        # Process lists
        self.resume.skills = llm_data.get("skills", [])
        self.resume.projects = llm_data.get("projects", [])
        self.resume.links = llm_data.get("links", [])
        
        return self.resume

def main():
    pdf_path = Path("data/resume.pdf")
    
    try:
        parser = ResumeParserLLM(pdf_path)
        resume = parser.parse()
        
        print("=== LLM-Parsed Resume ===")
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
                
        print("\nSkills:", ", ".join(resume.skills))
        print("\nProjects:")
        for project in resume.projects:
            print(f"- {project}")
        print("\nLinks:", ", ".join(resume.links))
            
    except Exception as e:
        print(f"Error processing resume: {str(e)}")

if __name__ == "__main__":
    main()