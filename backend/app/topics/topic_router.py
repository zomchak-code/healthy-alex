from fastapi import APIRouter

from app.cache.cache import cached

from .topic_service import topic_service

topic_router = APIRouter()


@topic_router.get("/domains")
async def get_domain():
    return cached("domains", topic_service.get_domain)
    # return topic_service.get_domain()


@topic_router.get("/fields/{id}")
async def get_field(id: str):
    return cached(f"fields/{id}", lambda: topic_service.get_field(id))
    # return topic_service.get_field(id)


@topic_router.get("/subfields/{id}")
async def get_subfield(id: str):
    return cached(f"subfields/{id}", lambda: topic_service.get_subfield(id))
    # return topic_service.get_subfield(id)
