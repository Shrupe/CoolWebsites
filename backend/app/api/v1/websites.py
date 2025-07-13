import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from uuid import UUID
import uuid
import httpx

from app.services.embedding import get_embedding
from app.schemas.website_s import WebsiteCreate, WebsiteRead, WebsiteListResponse
from app.models.website_m import Website
from app.core.db import get_db
from app.schemas.search import WebsiteSearchRequest
from app.crud.website_c import search_websites_by_embedding

router = APIRouter(prefix="/api/v1/websites")

# BRAVE_API_KEY = os.getenv("BRAVE_API_KEY")

# @router.post("/search-web", response_model=list[WebsiteRead])
# async def search_web(query: str = Body(...)):
#     headers = {"Accept": "application/json"}
#     params = {
#         "q": query,
#         "count": 10,
#         "key": BRAVE_API_KEY
#     }

#     async with httpx.AsyncClient() as client:
#         response = await client.get("https://api.search.brave.com/res/v1/web/search", params=params, headers=headers)

#     if response.status_code != 200:
#         raise HTTPException(status_code=500, detail="Failed to fetch results from Brave")

#     brave_data = response.json()

#     # Map Brave results to WebsiteRead-like format (fake UUIDs)
#     results = []
#     from uuid import uuid4
#     for item in brave_data.get("web", {}).get("results", []):
#         results.append({
#             "id": str(uuid4()),
#             "name": item["title"],
#             "url": item["url"],
#             "description": item.get("description", ""),
#             "tags": [],
#             "screenshot_url": None,
#             "created_at": datetime.utcnow().isoformat()
#         })

#     return results

@router.post(
        "/", 
        response_model=WebsiteRead,
        status_code=status.HTTP_201_CREATED
        )
async def create_website(
    website_data: WebsiteCreate, 
    db: AsyncSession = Depends(get_db)
    ):
    # Check for duplicates by URL
    result = await db.execute(
                        select(Website).where(Website.url == str(website_data.url))
                        )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Website already exists.")
    

    combined_text = f"\
            {website_data.name} - \
            {website_data.description} - \
            {', '.join(website_data.tags)}"
    embedding = await get_embedding(combined_text)


    new_website = Website(
        id=uuid.uuid4(),
        name=website_data.name,
        url=str(website_data.url),
        description=website_data.description,
        tags=website_data.tags,
        screenshot_url=website_data.screenshot_url,
        embedding=embedding
    )

    db.add(new_website)
    await db.commit()
    await db.refresh(new_website)

    return new_website

@router.post("/search", response_model=list[WebsiteRead])
async def search_websites(
    request: WebsiteSearchRequest,
    db: AsyncSession = Depends(get_db),
):
    embedding = await get_embedding(request.query)
    results = await search_websites_by_embedding(db, embedding, limit=request.limit)
    return results

@router.get("/", response_model=WebsiteListResponse)
async def list_websites(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    sort_by: str = Query("created_at", pattern="^(created_at|name)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    tag: str = None,
    search: str = None
):
    query = select(Website)

    # Filter by tag if specified
    if tag:
        query = query.where(Website.tags.any(tag))

    # Search filter
    if search:
        query = query.where(
            Website.name.ilike(f"%{search}%") |
            Website.description.ilike(f"%{search}%")
        )

    # Total count for pagination
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Sorting
    sort_column = getattr(Website, sort_by)
    if sort_order == "desc":
        sort_column = sort_column.desc()
    else:
        sort_column = sort_column.asc()

    # Apply sorting and pagination
    result = await db.execute(
        query.order_by(sort_column).offset(offset).limit(limit)
    )
    websites = result.scalars().all()

    return WebsiteListResponse(total=total, items=websites)

@router.get("/{website_id}", response_model=WebsiteRead)
async def get_website_by_id(
    website_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Website).where(Website.id == website_id))
    website = result.scalar_one_or_none()

    if website is None:
        raise HTTPException(status_code=404, detail="Website not found.")

    return website