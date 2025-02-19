from dataclasses import dataclass, field
from typing import List, Optional
from datetime import date

@dataclass
class Education:
    university: str
    degree: str
    major: str
    minor: Optional[str] = None
    gpa: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    coursework: List[str] = field(default_factory=list)