import magic
from PyPDF2 import PdfReader

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

 