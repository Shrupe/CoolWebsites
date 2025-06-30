from fastapi import FastAPI
from .api.v1 import websites

app = FastAPI(title="Coll Websites API")

app.include_router(
    websites.router, 
    prefix="/api/v1/websites", 
    tags=["websites"]
    )