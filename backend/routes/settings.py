from fastapi import APIRouter
from pydantic import BaseModel
from backend.db import get_conn

router = APIRouter(prefix="/settings", tags=["settings"])

SECRET_KEYS = {"anthropic_api_key", "openai_api_key", "deepseek_api_key", "google_api_key"}


class SettingBody(BaseModel):
    value: str


@router.get("/{key}")
def get_setting(key: str):
    with get_conn() as conn:
        row = conn.execute("SELECT value FROM settings WHERE key = ?", [key]).fetchone()
    value = row["value"] if row else ""
    if key in SECRET_KEYS:
        return {"key": key, "value": "", "is_set": bool(value)}
    return {"key": key, "value": value, "is_set": bool(value)}


@router.post("/{key}")
def set_setting(key: str, body: SettingBody):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO settings (key, value) VALUES (?, ?)"
            " ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            [key, body.value],
        )
    if key in SECRET_KEYS:
        return {"key": key, "value": "", "is_set": bool(body.value)}
    return {"key": key, "value": body.value, "is_set": bool(body.value)}
