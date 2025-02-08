import pdfplumber
import docx
import re
from dataclasses import dataclass
from typing import Dict, List

@dataclass
class ResumeData:
    sections: Dict[str, List[str]]
    metadata: Dict[str, str]
    raw_text: str
    layout: Dict

class ResumeParser:
    SECTION_PATTERNS = {
        'experience': r'(Experience|Work History)',
        'education': r'(Education|Academic Background)',
        'skills': r'(Skills|Technical Skills)'
    }

    def __init__(self):
        self.parsers = {
            'pdf': self._parse_pdf,
            'docx': self._parse_docx
        }

    def parse(self, file_bytes: bytes, file_type: str) -> ResumeData:
        parser = self.parsers.get(file_type)
        if not parser:
            raise ValueError(f"Unsupported file type: {file_type}")
        return parser(file_bytes)

    def _parse_pdf(self, file_bytes: bytes) -> ResumeData:
        with pdfplumber.open(file_bytes) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages])
            layout = self._analyze_layout(pdf)
        return self._structure_data(text, layout)

    def _parse_docx(self, file_bytes: bytes) -> ResumeData:
        doc = docx.Document(file_bytes)
        text = "\n".join([para.text for para in doc.paragraphs])
        return self._structure_data(text, {})

    def _analyze_layout(self, pdf):
        return {
            "fonts": self._extract_fonts(pdf),
            "sections": self._detect_sections(pdf)
        }

    def _structure_data(self, text: str, layout: Dict) -> ResumeData:
        sections = {}
        current_section = None
        
        for line in text.split('\n'):
            for section, pattern in self.SECTION_PATTERNS.items():
                if re.search(pattern, line, re.IGNORECASE):
                    current_section = section
                    sections[current_section] = []
                    break
            else:
                if current_section:
                    sections[current_section].append(line.strip())
        
        return ResumeData(
            sections={k: [ln for ln in v if ln] for k, v in sections.items()},
            metadata=self._extract_metadata(text),
            raw_text=text,
            layout=layout
        )