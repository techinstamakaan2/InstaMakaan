from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
import uuid


class InstagramPostBase(BaseModel):
    embed_url: str
    has_video: bool = False
    order: int = 0
    is_active: bool = True


class InstagramPostCreate(InstagramPostBase):
    pass


class InstagramPostUpdate(BaseModel):
    embed_url: Optional[str] = None
    has_video: Optional[bool] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class InstagramPost(InstagramPostBase):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime
    updated_at: datetime