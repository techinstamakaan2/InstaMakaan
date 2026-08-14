from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from .schemas import FAQCategoryCreateSchema, FAQCategoryUpdateSchema, FAQItemSchema
from . import service
from core.security import require_role

router = APIRouter(prefix="/faqs", tags=["FAQ"])


# ── Public: get all published categories (with their FAQs) ────────────────────
@router.get("")
@router.get("/")
async def get_faq_categories(
    status:  Optional[str]  = Query(None),
    no_faqs: Optional[bool] = Query(False),
):
    resolved_status = status if status else "published"
    categories = await service.get_all_categories(
        status=resolved_status,
        include_faqs=not no_faqs,
    )
    return categories


# ── Public: get single category by slug ───────────────────────────────────────
@router.get("/slug/{slug}")
async def get_faq_category_by_slug(slug: str):
    cat = await service.get_category_by_slug(slug)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


# ── Public: get single category by ID ────────────────────────────────────────
@router.get("/{category_id}")
async def get_faq_category(category_id: str):
    cat = await service.get_category_by_id(category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


# ── Admin: create a category ──────────────────────────────────────────────────
@router.post("")
@router.post("/", status_code=201, dependencies=[Depends(require_role(["ADMIN"]))])
async def create_faq_category(payload: FAQCategoryCreateSchema):
    cat = await service.create_category(payload.dict())
    return cat


# ── Admin: update a category ──────────────────────────────────────────────────
@router.put("/{category_id}", dependencies=[Depends(require_role(["ADMIN"]))])
async def update_faq_category(category_id: str, payload: FAQCategoryUpdateSchema):
    cat = await service.update_category(category_id, payload.dict(exclude_none=True))
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


# ── Admin: delete a category ──────────────────────────────────────────────────
@router.delete("/{category_id}", dependencies=[Depends(require_role(["ADMIN"]))])
async def delete_faq_category(category_id: str):
    deleted = await service.delete_category(category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}


# ── Admin: toggle published/draft ─────────────────────────────────────────────
@router.patch("/{category_id}/toggle-status", dependencies=[Depends(require_role(["ADMIN"]))])
async def toggle_faq_status(category_id: str):
    cat = await service.toggle_category_status(category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


# ── Admin: append a single FAQ item ──────────────────────────────────────────
@router.post("/{category_id}/faqs", dependencies=[Depends(require_role(["ADMIN"]))])
async def add_faq_item(category_id: str, payload: FAQItemSchema):
    cat = await service.add_faq_to_category(category_id, payload.dict())
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


# ── Admin: reorder categories ─────────────────────────────────────────────────
@router.post("/reorder", dependencies=[Depends(require_role(["ADMIN"]))])
async def reorder_faq_categories(ordered_ids: list[str]):
    await service.reorder_categories(ordered_ids)
    return {"message": "Order updated"}
