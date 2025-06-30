import time
import requests
from pydantic import BaseModel

from app.model.model import Item


class DomainResponse(BaseModel):
    fields: list[Item]
    works_api_url: str


class FieldResponse(BaseModel):
    domain: Item
    display_name: str
    siblings: list[Item]
    subfields: list[Item]
    works_api_url: str


class SubfieldResponse(BaseModel):
    field: Item
    display_name: str
    siblings: list[Item]
    topics: list[Item]
    works_api_url: str


class TopicService:
    def get_domain(self):
        start_time = time.time()

        res = requests.get("https://api.openalex.org/domains/4")
        domain_response = DomainResponse(**res.json())

        end_time = time.time()
        print(f"get_domain: {(end_time - start_time) * 1000} ms")
        return {
            "fields": [
                Item(id=field.id.split("/")[-1], display_name=field.display_name)
                for field in domain_response.fields
            ],
        }

    def get_field(self, id: str):
        res = requests.get(f"https://api.openalex.org/fields/{id}")
        field = FieldResponse(**res.json())

        field.domain.id = field.domain.id.split("/")[-1]
        for sibling in field.siblings:
            sibling.id = sibling.id.split("/")[-1]
        for subfield in field.subfields:
            subfield.id = subfield.id.split("/")[-1]

        return {
            "domain": field.domain,
            "display_name": field.display_name,
            "siblings": field.siblings,
            "subfields": field.subfields,
        }

    def get_subfield(self, id: str):
        res = requests.get(f"https://api.openalex.org/subfields/{id}")
        subfield = SubfieldResponse(**res.json())

        subfield.field.id = subfield.field.id.split("/")[-1]
        for sibling in subfield.siblings:
            sibling.id = sibling.id.split("/")[-1]
        for topic in subfield.topics:
            topic.id = topic.id.split("/")[-1]

        return {
            "field": subfield.field,
            "display_name": subfield.display_name,
            "siblings": subfield.siblings,
            "topics": subfield.topics,
        }


topic_service = TopicService()
