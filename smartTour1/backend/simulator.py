import asyncio
import random
from datetime import datetime, timezone
from typing import Any, Callable, Awaitable

from store import iso_now


def _tourist_dict(tourist: Any) -> dict[str, Any]:
    if isinstance(tourist, dict):
        return tourist
    return {
        "id": tourist.id,
        "name": tourist.name,
        "status": tourist.status,
        "latitude": tourist.latitude,
        "longitude": tourist.longitude,
        "heart_rate": tourist.heart_rate,
        "battery": tourist.battery,
        "activity": tourist.activity,
        "risk_score": tourist.risk_score,
        "wearable_id": tourist.wearable_id,
        "last_updated": tourist.last_updated,
        "location": tourist.location,
        "email": tourist.email,
        "phone": tourist.phone,
        "group": tourist.group,
    }


def jitter_tourist(tourist: Any) -> None:
    data = _tourist_dict(tourist)
    status = data["status"]

    if status == "safe":
        data["heart_rate"] = max(68, min(100, (data.get("heart_rate") or 72) + random.randint(-4, 6)))
        data["latitude"] += random.uniform(-0.0007, 0.0007)
        data["longitude"] += random.uniform(-0.0007, 0.0007)
        data["battery"] = max(25, data["battery"] - 1)
    elif status == "warning":
        data["heart_rate"] = max(90, min(120, (data.get("heart_rate") or 96) + random.randint(-8, 10)))
        data["latitude"] += random.uniform(-0.0012, 0.0012)
        data["longitude"] += random.uniform(-0.0012, 0.0012)
        data["battery"] = max(15, data["battery"] - 2)
    else:
        data["heart_rate"] = max(120, min(160, (data.get("heart_rate") or 135) + random.randint(-10, 12)))
        data["latitude"] += random.uniform(-0.002, 0.002)
        data["longitude"] += random.uniform(-0.002, 0.002)
        data["battery"] = max(10, data["battery"] - 1)

    data["last_updated"] = iso_now()
    data["location"] = f"Updated zone {random.randint(1, 4)}"

    if not isinstance(tourist, dict):
        for key, value in data.items():
            setattr(tourist, key, value)


async def simulator_loop(
    store: Any,
    on_update: Callable[[], Awaitable[None]] | None = None,
) -> None:
    while True:
        await asyncio.sleep(5)
        for tourist in store.tourists:
            if random.random() < 0.75:
                jitter_tourist(tourist)
                data = _tourist_dict(tourist)
                data["risk_score"] = max(8, min(99, data["risk_score"] + random.randint(-6, 8)))
                if data["risk_score"] > 70 and data["status"] == "safe":
                    data["status"] = "warning"
                elif data["risk_score"] > 85 and data["status"] != "emergency":
                    data["status"] = "emergency"
                elif data["risk_score"] < 40 and data["status"] == "warning":
                    data["status"] = "safe"
                if not isinstance(tourist, dict):
                    for key, value in data.items():
                        setattr(tourist, key, value)

        if random.random() < 0.6:
            selected = random.choice(store.tourists)
            selected_data = _tourist_dict(selected)
            alert_id = f"ALT-{int(datetime.now(timezone.utc).timestamp()) % 10000:04d}"
            store.alerts.insert(
                0,
                {
                    "id": alert_id,
                    "tourist_id": selected_data["id"],
                    "type": "AUTO_ALERT",
                    "severity": "high",
                    "status": "active",
                    "timestamp": iso_now(),
                    "message": "Sensor anomaly detected",
                    "location": selected_data["location"],
                    "latitude": selected_data["latitude"],
                    "longitude": selected_data["longitude"],
                    "heart_rate": selected_data.get("heart_rate"),
                    "battery": selected_data.get("battery"),
                },
            )
            store.activities.insert(
                0,
                {
                    "id": f"ACT-{alert_id}",
                    "tourist_id": selected_data["id"],
                    "event": "Auto alert generated",
                    "location": selected_data["location"],
                    "timestamp": iso_now(),
                    "status": "warning",
                },
            )

        if len(store.alerts) > 8:
            store.alerts = store.alerts[:8]
        if len(store.activities) > 8:
            store.activities = store.activities[:8]

        if on_update is not None:
            await on_update()
