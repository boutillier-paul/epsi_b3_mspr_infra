from fastapi import APIRouter


router = APIRouter()

@router.get("/")
async def api_root():
    return {"message": "Welcome on API root url"}