from typing import Optional
import requests
from pydantic import BaseModel

from app.model.model import Item


class Authorship(BaseModel):
    author: Item
    institutions: list[Item]
    raw_author_name: str


class Location(BaseModel):
    landing_page_url: str


class Work(BaseModel):
    id: str
    title: Optional[str]
    publication_date: str
    publication_year: int
    primary_location: Optional[Location]
    authorships: list[Authorship]
    topics: list[Item]
    cited_by_count: int


class WorksResponse(BaseModel):
    results: list[Work]


class WorkService:
    def get(self, id):
        res = requests.get(f"https://api.openalex.org/works/{id}")
        work = Work(**res.json())
        for authorship in work.authorships:
            authorship.author.id = authorship.author.id.split("/")[-1]
        for topic in work.topics:
            topic.id = topic.id.split("/")[-1]
        return work


work_service = WorkService()
