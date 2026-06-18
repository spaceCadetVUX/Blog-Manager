from fastapi import APIRouter
from pydantic import BaseModel
from backend.db import get_conn

router = APIRouter(prefix="/settings", tags=["settings"])


class SettingBody(BaseModel):
    value: str


@router.get("/{key}")
def get_setting(key: str):
    with get_conn() as conn:
        row = conn.execute("SELECT value FROM settings WHERE key = ?", [key]).fetchone()
    return {"key": key, "value": row["value"] if row else ""}


@router.post("/{key}")
def set_setting(key: str, body: SettingBody):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO settings (key, value) VALUES (?, ?)"
            " ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            [key, body.value],
        )
    return {"key": key, "value": body.value}
