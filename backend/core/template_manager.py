import yaml
import os
from pathlib import Path
from typing import Dict, List

class TemplateManager:
    def __init__(self, template_dir: str = "templates/styles"):
        self.templates = self._load_templates(template_dir)

    def _load_templates(self, template_dir: str) -> Dict:
        templates = {}
        for path in Path(template_dir).glob("*.yaml"):
            with open(path) as f:
                templates[path.stem] = yaml.safe_load(f)
        return templates

    def get_template(self, template_name: str) -> Dict:
        template = self.templates.get(template_name)
        if not template:
            raise ValueError(f"Template {template_name} not found")
        return template

    def apply_template(self, data: Dict, template_name: str) -> str:
        template = self.get_template(template_name)
        formatted = []
        
        # Header section
        formatted.append(f"\n{data['name']}\n")
        formatted.append("-" * 30)
        
        # Skills section
        if 'skills' in template['sections']:
            formatted.append("\nSkills:")
            formatted.append(
                self._format_skills(data['skills'], template['sections']['skills'])
            )
        
        return "\n".join(formatted)

    def _format_skills(self, skills: List[str], config: Dict) -> str:
        if config.get('type') == 'grid':
            col_width = max(len(skill) for skill in skills) + 2
            return "\n".join(
                " | ".join(f"{skill:<{col_width}}" for skill in skills[i:i+config['columns']])
                for i in range(0, len(skills), config['columns'])
            )
        return "\n".join(f"- {skill}" for skill in skills)