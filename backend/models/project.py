from dataclasses import dataclass, field
from typing import List, Optional
from datetime import date

@dataclass
class Project:
    name: str
    description: str
    technologies: List[str] = field(default_factory=list)
    start_date: Optional[date] = None
    end_date: Optional[date] = None