from pydantic import BaseModel
from typing import Optional, List, Any


class AuthorSchema(BaseModel):
    name: Optional[str] = ""
    role: Optional[str] = ""


class CommentCreateSchema(BaseModel):
    name: str
    text: str


# ── legacy: kept for backward compatibility ──
class SectionSchema(BaseModel):
    heading: Optional[str] = ""
    body: Optional[str] = ""        # HTML from TipTap rich text editor


class FAQSchema(BaseModel):
    q: Optional[str] = ""           # question
    a: Optional[str] = ""           # answer


class KeyStatSchema(BaseModel):
    label: Optional[str] = ""
    value: Optional[str] = ""
    icon:  Optional[str] = ""       # emoji e.g. "📈"


# ── NEW: content blocks ──
class BlockSchema(BaseModel):
    """
    A polymorphic content block. type is one of: "section" | "image" | "table"

    section:  { heading, body }
    image:    { url, caption }
    table:    { caption, rows, cols, data: list[list[str]], headerRow: bool }
    """
    type:      str
    id:        Optional[str] = None

    # section fields
    heading:   Optional[str] = None
    body:      Optional[str] = None

    # image fields
    url:       Optional[str] = None
    caption:   Optional[str] = None

    # table fields
    rows:      Optional[int] = None
    cols:      Optional[int] = None
    data:      Optional[List[List[Any]]] = None
    headerRow: Optional[bool] = True


class BlogCreateSchema(BaseModel):
    title:     str
    slug:      Optional[str] = None     
    excerpt:   Optional[str] = ""
    category:  Optional[str] = "Real Estate"
    date:      Optional[str] = ""
    readTime:  Optional[str] = "5 min read"
    image:     Optional[str] = ""        
    heroImage: Optional[str] = ""        
    author:    Optional[AuthorSchema] = AuthorSchema()

    blocks:    Optional[List[BlockSchema]] = []

    sections:  Optional[List[SectionSchema]] = []

    faqs:      Optional[List[FAQSchema]] = []
    keyStats:  Optional[List[KeyStatSchema]] = []
    toc:       Optional[List[str]] = []
    tags:      Optional[List[str]] = []
    status:    Optional[str] = "draft"
    views:     Optional[int] = 0
    order:     Optional[int] = None


class BlogUpdateSchema(BaseModel):
    title:     Optional[str] = None
    slug:      Optional[str] = None
    excerpt:   Optional[str] = None
    category:  Optional[str] = None
    date:      Optional[str] = None
    readTime:  Optional[str] = None
    image:     Optional[str] = None
    heroImage: Optional[str] = None
    author:    Optional[AuthorSchema] = None
    blocks:    Optional[List[BlockSchema]] = None
    sections:  Optional[List[SectionSchema]] = None
    faqs:      Optional[List[FAQSchema]] = None
    keyStats:  Optional[List[KeyStatSchema]] = None
    toc:       Optional[List[str]] = None
    tags:      Optional[List[str]] = None
    status:    Optional[str] = None
    views:     Optional[int] = None
    order:     Optional[int] = None