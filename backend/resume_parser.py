from typing import Optional
from pathlib import Path
from .models.resume import Resume
from .services.pdf_service import PDFService
from .services.claude_service import ClaudeService
from .utils.date_parser import DateParser

class ResumeParser:
    def __init__(self, api_key: Optional[str] = None):
        """Initialize ResumeParser with optional API key."""
        self.pdf_service = PDFService()
        self.claude_service = ClaudeService(api_key)
        
    def parse(self, pdf_path: str) -> Resume:
        """Parse a resume PDF and return a structured Resume object."""
        try:
            # Extract text from PDF
            resume_text = self.pdf_service.extract_text(pdf_path)
            
            # Get structured data from Claude
            resume_data = self.claude_service.extract_resume_data(resume_text)
            
            # Parse dates in the response
            self._parse_dates(resume_data)
            
            # Create and return Resume object
            return Resume(**resume_data)
            
        except Exception as e:
            raise Exception(f"Error parsing resume: {str(e)}")
            
    def _parse_dates(self, data: dict) -> None:
        """Parse all date strings in the resume data into date objects."""
        # Parse education dates
        for edu in data.get('education', []):
            edu['start_date'] = DateParser.parse_date(edu.get('start_date'))
            edu['end_date'] = DateParser.parse_date(edu.get('end_date'))
            
        # Parse experience dates
        for exp in data.get('experience', []):
            exp['start_date'] = DateParser.parse_date(exp.get('start_date'))
            exp['end_date'] = DateParser.parse_date(exp.get('end_date'))
            
        # Parse project dates
        for proj in data.get('projects', []):
            proj['start_date'] = DateParser.parse_date(proj.get('start_date'))
            proj['end_date'] = DateParser.parse_date(proj.get('end_date'))
