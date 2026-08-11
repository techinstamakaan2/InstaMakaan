from pydantic import BaseModel
from typing import Dict, List, Optional


class DashboardStats(BaseModel):
    total_properties: int
    active_properties: int
    total_inquiries: int
    new_inquiries: int
    total_owners: int
    total_agents: int
    total_users: Optional[int] = 0
    verified_users: Optional[int] = 0
    total_referrals: Optional[int] = 0
    properties_by_type: Dict[str, int]
    recent_inquiries: List[dict]
