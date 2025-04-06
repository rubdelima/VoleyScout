from fastapi import APIRouter
from app.routes.analyzer import router as ar
from app.routes.matches import router as mr
from app.routes.players import router as pr
from app.routes.teams import router as tr

router = APIRouter()

router.include_router(ar)
router.include_router(mr)
router.include_router(pr)
router.include_router(tr)