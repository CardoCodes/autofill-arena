import magic
from PyPDF2 import PdfReader
from typing import Dict, List
import os

def extract_text(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PdfReader(file)
        text = ''.join([page.extract_text() for page in reader.pages])
    return text

# for now we will onlyh be working with pdfs
def detect_file_type(file_bytes: bytes) -> str:
    mime = magic.from_buffer(file_bytes, mime=True)
    if 'pdf' in mime:
        return 'pdf'
    elif 'word' in mime:
        return 'docx'
    raise ValueError("Unsupported file type")

def get_pdf_metadata(pdf_path: str) -> Dict:
    """
    Extract metadata from a PDF file including creation date, author, title, etc.
    
    Args:
        pdf_path (str): Path to the PDF file
        
    Returns:
        Dict: Dictionary containing PDF metadata
    """
    try:
        with open(pdf_path, 'rb') as file:
            reader = PdfReader(file)
            metadata = reader.metadata
            
            # Clean and format metadata
            cleaned_metadata = {
                'title': metadata.get('/Title', 'Unknown'),
                'author': metadata.get('/Author', 'Unknown'),
                'creation_date': metadata.get('/CreationDate', 'Unknown'),
                'modified_date': metadata.get('/ModDate', 'Unknown'),
                'producer': metadata.get('/Producer', 'Unknown'),
                'page_count': len(reader.pages)
            }
            return cleaned_metadata
    except Exception as e:
        raise ValueError(f"Error extracting PDF metadata: {str(e)}")

def split_pdf_by_pages(pdf_path: str, page_ranges: List[tuple], output_dir: str) -> List[str]:
    """
    Split a PDF into multiple files based on page ranges.
    
    Args:
        pdf_path (str): Path to the PDF file
        page_ranges (List[tuple]): List of tuples containing start and end page numbers
                                 e.g., [(1,3), (4,6)] splits pages 1-3 and 4-6
        output_dir (str): Directory to save the split PDF files
        
    Returns:
        List[str]: List of paths to the created PDF files
    """
    try:
        with open(pdf_path, 'rb') as file:
            reader = PdfReader(file)
            output_files = []
            
            for i, (start, end) in enumerate(page_ranges):
                # Adjust for 0-based indexing
                start_idx = start - 1
                end_idx = min(end, len(reader.pages))
                
                if start_idx < 0 or start_idx >= len(reader.pages):
                    raise ValueError(f"Invalid start page number: {start}")
                
                # Create a new PDF writer
                from PyPDF2 import PdfWriter
                writer = PdfWriter()
                
                # Add specified pages
                for page_num in range(start_idx, end_idx):
                    writer.add_page(reader.pages[page_num])
                
                # Generate output filename
                base_name = os.path.splitext(os.path.basename(pdf_path))[0]
                output_path = os.path.join(output_dir, f"{base_name}_part{i+1}.pdf")
                
                # Save the split PDF
                with open(output_path, 'wb') as output_file:
                    writer.write(output_file)
                output_files.append(output_path)
                
            return output_files
    except Exception as e:
        raise ValueError(f"Error splitting PDF: {str(e)}")

 