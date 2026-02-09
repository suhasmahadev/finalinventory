import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from google.adk.cli.fast_api import get_fast_api_app

from routers import analytics,inventory,health,warehouse


# ---------------------------------------------------------
# Base Directory
# ---------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# ---------------------------------------------------------
# Fix for Pydantic v2 schema issue (ADK compatibility)
# ---------------------------------------------------------

try:
    import mcp.client.session
    from pydantic_core import core_schema

    mcp.client.session.ClientSession.__get_pydantic_core_schema__ = classmethod(
        lambda cls, source_type, handler: core_schema.any_schema()
    )
except ImportError:
    pass


# ---------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------

ALLOWED_ORIGINS = ["*"]  # Change in production


# ---------------------------------------------------------
# Initialize ADK FastAPI App
# ---------------------------------------------------------

app: FastAPI = get_fast_api_app(
    agents_dir=os.path.join(BASE_DIR, "home_inv_agent"),   # directory containing agent.py, tools.py, prompt.py
    web=False,
    allow_origins=ALLOWED_ORIGINS,
)


# ---------------------------------------------------------
# Include Application Routers
# ---------------------------------------------------------

app.include_router(inventory.router)
app.include_router(analytics.router)
app.include_router(health.router)
app.include_router(warehouse.router)

# ---------------------------------------------------------
# Static Frontend (Optional)
# ---------------------------------------------------------

frontend_dir = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")


# ---------------------------------------------------------
# Run Server
# ---------------------------------------------------------

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=True
    )
