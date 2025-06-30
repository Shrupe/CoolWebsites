from typing import List, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, HttpUrl

class WebsiteBase(BaseModel):
    name: str
    url: HttpUrl
    description: str
    tags: List[str] = []
    screenshot_url: Optional[HttpUrl] = None

class WebsiteCreate(WebsiteBase):
    pass

class WebsiteRead(WebsiteBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
