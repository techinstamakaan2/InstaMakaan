from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Union
from typing import Dict, Any
from datetime import datetime
import uuid


class PropertyBase(BaseModel):
    title: str
    property_type: str
    location: str
    sector: Optional[str] = None
    city: Optional[str] = None
    locality: Optional[str] = None
    price: str
    price_label: str
    description: str
    beds: int
    baths: int
    area: str
    features: List[str] = []
    amenities: List[str] = []
    furnishing: Optional[str] = None
    preferred_tenant: Optional[str] = None
    gender_preference: Optional[str] = None
    is_managed: bool = False
    status: str = "active"
    deposit: Optional[str] = None
    brokerage: Optional[str] = None
    owner_id: Optional[str] = None
    monthly_rent_amount: Optional[float] = None

    parent_property_id: Optional[str] = None
    is_parent: bool = False
    room_type: Optional[str] = None
    available_from: Optional[datetime] = None
    attached_bath: Optional[bool] = None
    balcony: Optional[bool] = None
    map_embed: Optional[str] = None
    neighborhood: Optional[Dict[str, Any]] = None
    rooms: Optional[List[Dict[str, Any]]] = []

    managed_by: Optional[str] = None

    # ✅ Bug 4 Fix: listing_mode aur thumbnail_image schema mein add kiye
    listing_mode: Optional[str] = None
    thumbnail_image: Optional[str] = None


class PropertyList(BaseModel):
    id: str
    title: str
    property_type: str
    location: str
    sector: Optional[str] = None
    city: Optional[str] = None
    price: str
    price_label: str
    beds: int
    baths: int
    status: str
    # ✅ Bug 5 Fix: monthly_rent_amount add kiya — price filter ke liye zaroori
    monthly_rent_amount: Optional[float] = None
    thumbnail: Optional[str] = None


class PropertyCreate(PropertyBase):
    images: List[Union[str, dict]] = []


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    property_type: Optional[str] = None
    location: Optional[str] = None
    sector: Optional[str] = None
    city: Optional[str] = None
    locality: Optional[str] = None
    price: Optional[str] = None
    price_label: Optional[str] = None
    description: Optional[str] = None
    beds: Optional[int] = None
    baths: Optional[int] = None
    area: Optional[str] = None
    features: Optional[List[str]] = None
    amenities: Optional[List[str]] = None
    furnishing: Optional[str] = None
    preferred_tenant: Optional[str] = None
    gender_preference: Optional[str] = None
    is_managed: Optional[bool] = None
    status: Optional[str] = None
    deposit: Optional[str] = None
    brokerage: Optional[str] = None
    images: Optional[List[Union[str, dict]]] = None
    owner_id: Optional[str] = None
    monthly_rent_amount: Optional[float] = None

    map_embed: Optional[str] = None
    neighborhood: Optional[Dict[str, Any]] = None
    rooms: Optional[List[Dict[str, Any]]] = None

    # PRE-OCCUPIED
    parent_property_id: Optional[str] = None
    is_parent: Optional[bool] = None
    room_type: Optional[str] = None
    available_from: Optional[datetime] = None
    attached_bath: Optional[bool] = None
    balcony: Optional[bool] = None

    managed_by: Optional[str] = None

    # ✅ Bug 4 Fix: listing_mode aur thumbnail_image update mein bhi
    listing_mode: Optional[str] = None
    thumbnail_image: Optional[str] = None


class Property(PropertyBase):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    images: List[Union[str, dict]] = []
    created_at: datetime
    updated_at: datetime