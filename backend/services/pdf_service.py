from typing import Optional
import PyPDF2
from pathlib import Path

class PDFService:
    @staticmethod
    def extract_text(pdf_path: str) -> Optional[str]:
        """Extract text content from a PDF file."""
        try:
            if not Path(pdf_path).exists():
                raise FileNotFoundError(f"PDF file not found: {pdf_path}")

            text = ""
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text()
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
