import requests
from pydantic import BaseModel

from app.works.work_service import Work, WorksResponse
from app.model.model import Item


class PersonTopic(BaseModel):
    id: str
    display_name: str
    count: int
    field: Item
    subfield: Item
    domain: Item


class PersonResponse(BaseModel):
    id: str
    display_name: str
    works_count: int
    cited_by_count: int
    last_known_institutions: list[Item]
    topics: list[PersonTopic]
    works_api_url: str


def get_authors(works: list[Work]):
    author_works = {}
    for work in works:
        for authorship in work.authorships:
            author_id = authorship.author.id.split("/")[-1]
            if author_id not in author_works:
                author_works[author_id] = {
                    "id": author_id,
                    "display_name": authorship.raw_author_name,
                    "institutions": authorship.institutions,
                    "total_citations": 0,
                }
            author_works[author_id]["total_citations"] += work.cited_by_count
    sorted_authors = sorted(
        author_works.values(), key=lambda x: x["total_citations"], reverse=True
    )
    return sorted_authors


class PersonService:
    def get_people(self, topic_type: str, topic_id: str):
        url = f"https://api.openalex.org/works?filter={topic_type}.id:{topic_id}&per_page=200"
        res = requests.get(url)
        works_response = WorksResponse(**res.json())
        return get_authors(works_response.results)

    def get_person(self, id: str):
        res = requests.get(f"https://api.openalex.org/people/{id}")
        person = PersonResponse(**res.json())
        res = requests.get(person.works_api_url + "&per_page=200")
        works = [Work(**w) for w in res.json()["results"]]
        for work in works:
            work.id = work.id.split("/")[-1]

        return {
            "id": person.id,
            "display_name": person.display_name,
            "works_count": person.works_count,
            "cited_by_count": person.cited_by_count,
            "last_known_institutions": person.last_known_institutions,
            "works": works,
        }

    def find_contacts(self, name: str):
        # Post with plain text body
        return requests.post(
            "https://techcenary--5284aba44de911f089f476b3cceeab13.web.val.run",
            data=name,
        ).json()


person_service = PersonService()
