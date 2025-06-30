from fastapi import APIRouter

from app.cache.cache import cached

from .work_service import work_service

work_router = APIRouter(prefix="/works")


@work_router.get("/{id}")
async def get_work(id: str):
    return cached(f"works/{id}", lambda: work_service.get(id))
