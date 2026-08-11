from pydantic import BaseModel
from typing import Optional, List


class FAQItemSchema(BaseModel):
    """A single question-answer pair inside a category."""
    question: str
    answer: str


class FAQCategoryCreateSchema(BaseModel):
    name: str                                      # e.g. "General", "Pre-Occupied"
    slug: Optional[str] = None                     # auto-generated if omitted
    description: Optional[str] = ""
    icon: Optional[str] = ""                       # emoji or icon name
    order: Optional[int] = 0                       # display order
    status: Optional[str] = "published"            # "published" | "draft"
    faqs: Optional[List[FAQItemSchema]] = []


class FAQCategoryUpdateSchema(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    status: Optional[str] = None
    faqs: Optional[List[FAQItemSchema]] = None