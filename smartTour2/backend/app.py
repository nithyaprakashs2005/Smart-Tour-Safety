from __future__ import annotations

import asyncio
import os
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from store import DEMO_DEVICE_ID, DEMO_TOURIST_ID, apply_telemetry, make_demo_data, snapshot_to_dashboard
from firebase_service import init_firebase, is_firebase_ready, load_demo_state, sync_dashboard_state

API_PREFIX = "/api"


class Store:
    def __init__(self) -> None:
        self.tourists, self.wearables, self.alerts, self.activities, self.analytics = make_demo_data()
        self.websocket_clients: set[WebSocket] = set()


store = Store()


def _as_dict(value: Any) -> dict[str, Any]:
    if value is None:
        return {}
    if isinstance(value, dict):
        return value
    if hasattr(value, "__dict__"):
        return value.__dict__
    return dict(value)


def _find_by_id(items: list[Any], item_id: str, key: str = "id") -> dict[str, Any] | None:
    for item in items:
        data = _as_dict(item)
        if data.get(key) == item_id:
            return data
    return None


async def broadcast_state() -> None:
    payload = snapshot_to_dashboard(store.tourists, store.alerts, store.activities, store.analytics, store.wearables)
    
    # Broadcast to connected local websockets
    for ws in list(store.websocket_clients):
        try:
            await ws.send_json({"type": "state", "data": payload})
        except Exception:
            store.websocket_clients.discard(ws)

    # Sync to Firebase Cloud if connected
    if is_firebase_ready():
        try:
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(
                None, sync_dashboard_state, store.tourists, store.alerts, store.activities, store.wearables, store.analytics
            )
        except Exception:
            pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_firebase()
    if is_firebase_ready():
        try:
            persisted_state = load_demo_state(DEMO_TOURIST_ID, DEMO_DEVICE_ID)
            if persisted_state is not None:
                store.tourists, store.wearables, store.alerts, store.activities, store.analytics = persisted_state
            else:
                sync_dashboard_state(store.tourists, store.alerts, store.activities, store.wearables, store.analytics)
        except Exception:
            pass
    yield


app = FastAPI(title="SmartTour Safety API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(f"{API_PREFIX}/health")
async def health() -> dict[str, Any]:
    return {"status": "ok", "service": "smarttour-safety-api"}


@app.get(f"{API_PREFIX}/dashboard")
async def dashboard() -> dict[str, Any]:
    return snapshot_to_dashboard(store.tourists, store.alerts, store.activities, store.analytics, store.wearables)


@app.post(f"{API_PREFIX}/tourists/location")
async def update_tourist_location(payload: dict[str, Any]) -> dict[str, Any]:
    lat = payload.get("lat", payload.get("latitude"))
    lng = payload.get("lng", payload.get("longitude"))
    loc_name = payload.get("location") or "Live device location"
    if lat is not None and lng is not None and store.tourists:
        tourist = store.tourists[0]
        wearable = store.wearables[0]
        apply_telemetry(tourist, wearable, store.analytics, {**payload, "location": loc_name})
        await broadcast_state()
        return {"status": "updated", "latitude": tourist["latitude"], "longitude": tourist["longitude"], "location": tourist["location"]}
    raise HTTPException(status_code=400, detail="Invalid coordinates")


@app.get(f"{API_PREFIX}/tourists")
async def get_tourists() -> list[dict[str, Any]]:
    return [_as_dict(tourist) for tourist in store.tourists]


@app.get(f"{API_PREFIX}/tourists/{{tourist_id}}")
async def get_tourist(tourist_id: str) -> dict[str, Any]:
    tourist = _find_by_id(store.tourists, tourist_id)
    if tourist is None:
        raise HTTPException(status_code=404, detail="Tourist not found")
    return tourist


@app.get(f"{API_PREFIX}/alerts")
async def get_alerts() -> list[dict[str, Any]]:
    return [_as_dict(alert) for alert in store.alerts]


@app.get(f"{API_PREFIX}/alerts/{{alert_id}}")
async def get_alert(alert_id: str) -> dict[str, Any]:
    alert = _find_by_id(store.alerts, alert_id)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@app.get(f"{API_PREFIX}/wearables")
async def get_wearables() -> list[dict[str, Any]]:
    return [_as_dict(wearable) for wearable in store.wearables]


@app.get(f"{API_PREFIX}/wearables/{{wearable_id}}")
async def get_wearable(wearable_id: str) -> dict[str, Any]:
    wearable = _find_by_id(store.wearables, wearable_id)
    if wearable is None:
        raise HTTPException(status_code=404, detail="Wearable not found")
    return wearable


@app.get(f"{API_PREFIX}/locations")
async def get_locations() -> list[dict[str, float | str]]:
    return [
        {"id": tourist["id"], "name": tourist["name"], "lat": tourist["latitude"], "lng": tourist["longitude"]}
        for tourist in store.tourists
        if tourist.get("latitude") is not None and tourist.get("longitude") is not None
    ]


@app.get(f"{API_PREFIX}/analytics")
async def get_analytics() -> dict[str, Any]:
    return store.analytics if store.analytics else {}


@app.post(f"{API_PREFIX}/alerts/{{alert_id}}/acknowledge")
async def acknowledge_alert(alert_id: str) -> dict[str, str]:
    alert = _find_by_id(store.alerts, alert_id)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert["status"] = "acknowledged"
    await broadcast_state()
    return {"status": "acknowledged", "alertId": alert_id}


@app.post(f"{API_PREFIX}/alerts/{{alert_id}}/resolve")
async def resolve_alert(alert_id: str) -> dict[str, str]:
    alert = _find_by_id(store.alerts, alert_id)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert["status"] = "resolved"
    tourist = _find_by_id(store.tourists, alert.get("tourist_id"))
    if tourist is not None:
        tourist["status"] = "safe"
    await broadcast_state()
    return {"status": "resolved", "alertId": alert_id}


@app.post(f"{API_PREFIX}/tourists/{{tourist_id}}/dispatch")
async def dispatch_rescue(tourist_id: str) -> dict[str, str]:
    tourist = _find_by_id(store.tourists, tourist_id)
    if tourist is None:
        raise HTTPException(status_code=404, detail="Tourist not found")
    return {"status": "dispatched", "touristId": tourist_id, "message": f"Rescue team dispatched to {tourist.get('location')}"}


@app.post(f"{API_PREFIX}/tourists/{{tourist_id}}/route")
async def route_to_tourist(tourist_id: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    tourist = _find_by_id(store.tourists, tourist_id)
    if tourist is None:
        raise HTTPException(status_code=404, detail="Tourist not found")
    origin = payload.get("origin", {"lat": 30.74, "lng": 79.42}) if payload else {"lat": 30.74, "lng": 79.42}
    distance_km = ((tourist["latitude"] - origin["lat"]) ** 2 + (tourist["longitude"] - origin["lng"]) ** 2) ** 0.5 * 111.32
    eta_minutes = max(4, int(distance_km / 2.2))
    return {
        "distanceKm": round(distance_km, 1),
        "etaMinutes": eta_minutes,
        "origin": {"name": "Rescue Command Post", "lat": origin["lat"], "lng": origin["lng"]},
        "destination": {"name": tourist["name"], "lat": tourist["latitude"], "lng": tourist["longitude"]},
    }


@app.get(f"{API_PREFIX}/firebase/status")
async def firebase_status() -> dict[str, Any]:
    ready = is_firebase_ready()
    return {
        "configured": ready,
        "mode": "cloud_firestore" if ready else "local_in_memory",
        "collections": ["tourists", "alerts", "activities", "wearables", "dispatches"] if ready else [],
        "message": "Connected to Firebase Cloud Firestore" if ready else "Firebase running in local fallback mode. Add service account credentials to enable Cloud sync.",
    }


@app.post(f"{API_PREFIX}/firebase/sync")
async def trigger_firebase_sync() -> dict[str, Any]:
    if not is_firebase_ready():
        return {
            "status": "warning",
            "message": "Firebase not configured on backend. Set FIREBASE_CREDENTIALS_PATH or GOOGLE_APPLICATION_CREDENTIALS to enable.",
        }
    success = sync_dashboard_state(store.tourists, store.alerts, store.activities, store.wearables, store.analytics)
    return {
        "status": "ok" if success else "error",
        "syncedTourists": len(store.tourists),
        "syncedAlerts": len(store.alerts),
        "syncedActivities": len(store.activities),
    }


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket) -> None:
    await ws.accept()
    store.websocket_clients.add(ws)
    try:
        await ws.send_json({"type": "state", "data": snapshot_to_dashboard(store.tourists, store.alerts, store.activities, store.analytics, store.wearables)})
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        store.websocket_clients.discard(ws)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
