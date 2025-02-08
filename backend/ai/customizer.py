from sentence_transformers import SentenceTransformer
import numpy as np
from typing import Dict, List

class ResumeCustomizer:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.skill_cache = {}

    def customize_resume(
        self, 
        resume_data: Dict,
        job_description: Dict,
        template_config: Dict
    ) -> Dict:
        customized = {}
        
        # Skills customization
        customized['skills'] = self._match_skills(
            resume_data['skills'],
            job_description['required_skills'],
            template_config.get('skill_sort', 'frequency')
        )

        # Experience rewriting
        customized['experience'] = [
            self._rewrite_experience(
                exp, 
                job_description['keywords'],
                template_config.get('experience_rewrite', 'conservative')
            )
            for exp in resume_data['experience']
        ]

        return customized

    def _match_skills(self, resume_skills, jd_skills, sort_strategy):
        # Semantic matching implementation
        resume_emb = self.model.encode(resume_skills)
        jd_emb = self.model.encode(jd_skills)
        similarity = np.dot(resume_emb, jd_emb.T)
        
        sorted_indices = np.argsort(-similarity.max(axis=1))
        return [resume_skills[i] for i in sorted_indices]

    def _rewrite_experience(self, experience_text, keywords, style):
        # Actual LLM integration would go here
        return f"{experience_text} ({', '.join(keywords)})"