from pydantic import BaseModel


class Item(BaseModel):
    id: str
    display_name: str
