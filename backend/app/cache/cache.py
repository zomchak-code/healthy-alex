from upstash_redis import Redis
from typing import Callable
import json
from pydantic import BaseModel

redis = Redis.from_env()


def cached(key: str, func: Callable):
    value = redis.get(key)
    if not value:
        value = func()
        # Serialize the value to JSON before storing in Redis
        serialized_value = json.dumps(
            value, default=lambda obj: obj.dict() if isinstance(obj, BaseModel) else obj
        )
        redis.set(key, serialized_value)
        return value
    else:
        # Deserialize the JSON value from Redis
        return json.loads(value)
