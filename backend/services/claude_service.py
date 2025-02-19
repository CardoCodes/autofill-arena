import os
import json
from typing import Dict, Any
import anthropic
from .prompt_service import PromptService

class ClaudeService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("Anthropic API key not provided")
        self.client = anthropic.Anthropic(api_key=self.api_key)

    def extract_resume_data(self, resume_text: str) -> Dict[str, Any]:
        """Extract resume information using Claude API."""
        try:
            prompt = PromptService.create_resume_prompt(resume_text)
            
            message = self.client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=4096,
                temperature=0,
                system="You are a resume parsing assistant. Extract information from resumes and return it in the specified JSON format. Be precise and thorough.",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            return json.loads(message.content)
        except Exception as e:
            raise Exception(f"Error extracting resume data from Claude: {str(e)}")
