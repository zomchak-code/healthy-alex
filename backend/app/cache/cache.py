import time
from upstash_redis import Redis
from typing import Callable
import json
from pydantic import BaseModel

redis = Redis.from_env()


def cached(key: str, func: Callable):
    # time the request
    start_time = time.time()

    value = redis.get(key)
    if not value:
        value = func()
        # Serialize the value to JSON before storing in Redis
        serialized_value = json.dumps(
            value, default=lambda obj: obj.dict() if isinstance(obj, BaseModel) else obj
        )
        redis.set(key, serialized_value)

        end_time = time.time()
        print(f"Cache miss: {key} took {(end_time - start_time) * 1000} ms")

        return value
    else:
        # Deserialize the JSON value from Redis
        deserialized_value = json.loads(value)

        end_time = time.time()
        print(f"Cache hit: {key} took {(end_time - start_time) * 1000} ms")

        return deserialized_value
