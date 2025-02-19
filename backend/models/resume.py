from dataclasses import dataclass, field
from typing import List, Optional
from .education import Education
from .experience import Experience
from .project import Project

@dataclass
class Resume:
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    email: Optional[str] = None
    links: List[str] = field(default_factory=list)
    address: Optional[str] = None
    education: List[Education] = field(default_factory=list)
    skills: List[str] = field(default_factory=list)
    awards: List[str] = field(default_factory=list)
    experience: List[Experience] = field(default_factory=list)
    projects: List[Project] = field(default_factory=list)