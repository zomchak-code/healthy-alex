from fastapi import APIRouter

from app.cache.cache import cached

from .person_service import person_service

person_router = APIRouter(prefix="/people")


@person_router.get("/{id}")
async def get_person(id: str):
    return cached(f"people/{id}", lambda: person_service.get_person(id))


@person_router.get("/list/{topic_type}/{topic_id}")
async def get_people(topic_type: str, topic_id: str):
    return cached(
        f"people/{topic_type}/{topic_id}",
        lambda: person_service.get_people(topic_type, topic_id),
    )


@person_router.get("/contacts/{name}")
async def find_contacts(name: str):
    return cached(f"contacts/{name}", lambda: person_service.find_contacts(name))
