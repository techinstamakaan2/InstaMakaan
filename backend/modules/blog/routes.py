from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Depends
from typing import Optional
from .schemas import BlogCreateSchema, BlogUpdateSchema, CommentCreateSchema
from . import service
from core.security import require_role

router = APIRouter(prefix="/blogs", tags=["Blog"])


# ── image upload ──────────────────────────────────────────────────────────────
@router.post("/upload/image", dependencies=[Depends(require_role(["ADMIN"]))])
async def upload_image(file: UploadFile = File(...)):
    url = await service.save_upload(file)
    return {"url": url}


# ── blog CRUD ─────────────────────────────────────────────────────────────────
@router.get("/")
async def get_blogs(
    category: Optional[str] = Query(None),
    search:   Optional[str] = Query(None),
    status:   Optional[str] = Query(None),
    limit:    Optional[int] = Query(None),
    exclude:  Optional[str] = Query(None),
):
    resolved_status = status if status else "published"
    posts = await service.get_all_blogs(
        category=category,
        search=search,
        status=resolved_status,
        limit=limit,
        exclude=exclude,
    )
    return posts


@router.get("/slug/{slug}")
async def get_blog_by_slug(slug: str):
    post = await service.get_blog_by_slug(slug)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.get("/{blog_id}")
async def get_blog(blog_id: str):
    post = await service.get_blog_by_id(blog_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/", status_code=201, dependencies=[Depends(require_role(["ADMIN"]))])
async def create_blog(payload: BlogCreateSchema):
    post = await service.create_blog(payload.dict())
    return post


@router.put("/{blog_id}", dependencies=[Depends(require_role(["ADMIN"]))])
async def update_blog(blog_id: str, payload: BlogUpdateSchema):
    post = await service.update_blog(blog_id, payload.dict(exclude_none=True))
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.delete("/{blog_id}", dependencies=[Depends(require_role(["ADMIN"]))])
async def delete_blog(blog_id: str):
    deleted = await service.delete_blog(blog_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}


@router.patch("/{blog_id}/toggle-status", dependencies=[Depends(require_role(["ADMIN"]))])
async def toggle_status(blog_id: str):
    post = await service.toggle_blog_status(blog_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


# ── comments ──────────────────────────────────────────────────────────────────
@router.get("/{blog_id}/comments")
async def get_comments(blog_id: str):
    return await service.get_comments(blog_id)


@router.post("/{blog_id}/comments", status_code=201)
async def add_comment(blog_id: str, payload: CommentCreateSchema):
    if not payload.name.strip() or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Name and comment text are required")
    return await service.add_comment(blog_id, payload.name, payload.text)
