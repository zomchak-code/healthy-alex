# Healthy Alex backend

## Running locally

### Config 

Set env variables, you can the them at [Upstach](https://upstash.com):
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Running

1. Install uv: `curl -LsSf https://astral.sh/uv/install.sh | sh`
2. Install packages `uv sync`
3. Run it: `uv run fastapi dev`