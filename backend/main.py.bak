from core.resume_parser import ResumeParser
from core.template_manager import TemplateManager
from ai.customizer import ResumeCustomizer

class ResumeAI:
    def __init__(self):
        self.parser = ResumeParser()
        self.customizer = ResumeCustomizer()
        self.template_mgr = TemplateManager()

    def process_resume(
        self,
        resume_file: bytes,
        file_type: str,
        job_description: str,
        template: str = "modern_tech"
    ) -> str:
        # Parse resume
        resume_data = self.parser.parse(resume_file, file_type)
        
        # Analyze job description
        jd_analysis = self._analyze_jd(job_description)
        
        # Customize content
        customized = self.customizer.customize_resume(
            resume_data.__dict__,
            jd_analysis,
            self.template_mgr.get_template(template)
        )
        
        # Apply template
        return self.template_mgr.apply_template(customized, template)

    def _analyze_jd(self, text: str) -> Dict:
        # Simplified JD analysis
        return {
            "required_skills": ["Python", "AI"],
            "keywords": ["machine learning", "cloud"]
        }

# Example usage
if __name__ == "__main__":
    ai = ResumeAI()
    with open("resume.pdf", "rb") as f:
        result = ai.process_resume(
            f.read(),
            "pdf",
            "Looking for Python developer with AI experience",
            "modern_tech"
        )
    print(result)