from dotenv import load_dotenv
from .resume_parser import ResumeParser

def main():
    # Load environment variables
    load_dotenv()
    
    # Initialize parser
    parser = ResumeParser()
    
    # Example usage
    pdf_path = "path/to/resume.pdf"
    try:
        resume = parser.parse(pdf_path)
        print(f"Parsed resume for {resume.first_name} {resume.last_name}")
        print(f"Email: {resume.email}")
        print(f"Skills: {', '.join(resume.skills)}")
        # Add more printing logic as needed
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()