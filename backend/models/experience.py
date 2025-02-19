from dataclasses import dataclass, field
from typing import List, Optional
from datetime import date

@dataclass
class Experience:
    company: str
    title: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: List[str] = field(default_factory=list)