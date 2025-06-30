from fastapi import FastAPI

from .topics.topic_router import topic_router
from .people.person_router import person_router
from .works.work_router import work_router

app = FastAPI()

app.include_router(topic_router)
app.include_router(person_router)
app.include_router(work_router)
