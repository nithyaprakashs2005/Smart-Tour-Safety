from __future__ import annotations

from datetime import datetime, timezone
from math import asin, cos, radians, sin, sqrt
from typing import Any


DEMO_TOURIST_ID = "T-DEMO-01"
DEMO_DEVICE_ID = "DEV-1001"


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _status_from_risk(score: int) -> str:
    if score >= 75:
        return "emergency"
    if score >= 40:
        return "warning"
    return "safe"


def make_demo_data() -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    """Create the one record used only when Firestore has not been seeded yet."""
    timestamp = iso_now()
    tourist = {
        "id": DEMO_TOURIST_ID,
        "name": "Demo Tourist",
        "status": "safe",
        "latitude": None,
        "longitude": None,
        "heart_rate": None,
        "heart_rate_variability": None,
        "spo2": None,
        "body_temperature": None,
        "blood_pressure": None,
        "battery": None,
        "activity": "Waiting for live telemetry",
        "risk_score": 0,
        "wearable_id": DEMO_DEVICE_ID,
        "last_updated": timestamp,
        "location": "Waiting for device location",
    }
    wearable = {
        "id": DEMO_DEVICE_ID,
        "deviceId": DEMO_DEVICE_ID,
        "tourist_id": DEMO_TOURIST_ID,
        "tourist_name": tourist["name"],
        "type": "gps-band",
        "model": "Demo GPS device",
        "status": "waiting",
        "battery": None,
        "last_seen": timestamp,
        "connected": False,
        "sensor_status": "waiting_for_telemetry",
        "heart_rate": None,
        "heart_rate_variability": None,
        "spo2": None,
        "body_temperature": None,
        "blood_pressure": None,
    }
    analytics = {
        "tourist_id": DEMO_TOURIST_ID,
        "tourist_name": tourist["name"],
        "device_id": DEMO_DEVICE_ID,
        "live_heart_rate": None,
        "live_battery": None,
        "live_risk_score": 0,
        "distance_km": 0,
        "steps_count": 0,
        "active_duration_minutes": 0,
        "elevation_gain_m": 0,
        "current_altitude_m": None,
        "current_speed_kmh": None,
        "current_zone": "Waiting for device location",
        "zone_status": "No live location",
        "geofence_breaches": 0,
        "heart_rate_trend": [],
        "battery_trend": [],
        "risk_trend": [],
        "activity_breakdown": [],
        "vitals_summary": {},
        "last_updated": timestamp,
    }
    return [tourist], [wearable], [], [], analytics


def _distance_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    radius_km = 6371.0088
    d_lat = radians(lat2 - lat1)
    d_lng = radians(lng2 - lng1)
    a = sin(d_lat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lng / 2) ** 2
    return radius_km * 2 * asin(sqrt(a))


def apply_telemetry(tourist: dict[str, Any], wearable: dict[str, Any], analytics: dict[str, Any], telemetry: dict[str, Any]) -> None:
    """Apply a genuine device update without manufacturing positions or health data."""
    previous_lat, previous_lng = tourist.get("latitude"), tourist.get("longitude")
    lat, lng = telemetry.get("lat", telemetry.get("latitude")), telemetry.get("lng", telemetry.get("longitude"))
    if lat is not None and lng is not None:
        tourist["latitude"], tourist["longitude"] = float(lat), float(lng)
        tourist["location"] = str(telemetry.get("location") or "Live device location")
        analytics["current_zone"] = tourist["location"]
        analytics["zone_status"] = "Live location received"
        if previous_lat is not None and previous_lng is not None:
            analytics["distance_km"] = round(float(analytics.get("distance_km", 0)) + _distance_km(float(previous_lat), float(previous_lng), float(lat), float(lng)), 3)

    for field in (
        "heart_rate",
        "heart_rate_variability",
        "spo2",
        "body_temperature",
        "blood_pressure",
        "battery",
        "activity",
        "risk_score",
    ):
        if telemetry.get(field) is not None:
            tourist[field] = telemetry[field]
    for field in ("steps_count", "active_duration_minutes", "elevation_gain_m", "current_altitude_m", "current_speed_kmh", "geofence_breaches"):
        if telemetry.get(field) is not None:
            analytics[field] = telemetry[field]

    heart_rate, battery = tourist.get("heart_rate"), tourist.get("battery")
    risk_score = int(tourist.get("risk_score") or 0)
    tourist["status"] = _status_from_risk(risk_score)
    tourist["last_updated"] = iso_now()
    wearable.update({"status": "online", "connected": True, "last_seen": tourist["last_updated"], "battery": battery, "sensor_status": "healthy" if tourist["status"] == "safe" else tourist["status"], "heart_rate": tourist.get("heart_rate"), "heart_rate_variability": tourist.get("heart_rate_variability"), "spo2": tourist.get("spo2"), "body_temperature": tourist.get("body_temperature"), "blood_pressure": tourist.get("blood_pressure")})

    analytics.update({"live_heart_rate": heart_rate, "live_battery": battery, "live_risk_score": risk_score, "last_updated": tourist["last_updated"]})
    point_time = datetime.now(timezone.utc).strftime("%H:%M:%S")
    for trend_key, value_key, value in (("heart_rate_trend", "bpm", heart_rate), ("battery_trend", "battery", battery), ("risk_trend", "score", risk_score)):
        if value is not None:
            trend = analytics.setdefault(trend_key, [])
            trend.append({"time": point_time, value_key: value})
            analytics[trend_key] = trend[-60:]

    heart_rate_values = [point["bpm"] for point in analytics.get("heart_rate_trend", []) if point.get("bpm") is not None]
    if heart_rate_values:
        analytics["vitals_summary"] = {"avg_heart_rate": round(sum(heart_rate_values) / len(heart_rate_values)), "max_heart_rate": max(heart_rate_values), "min_heart_rate": min(heart_rate_values)}


def _to_dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else value.__dict__


def snapshot_to_dashboard(tourists: list[Any], alerts: list[Any], activities: list[Any], analytics: dict[str, Any] | None = None, wearables: list[Any] | None = None) -> dict[str, Any]:
    tourist_records = [_to_dict(t) for t in tourists]
    wearable_records = [_to_dict(w) for w in wearables or []]
    active_alerts = [a for a in alerts if _to_dict(a).get("status") in {"active", "acknowledged"}]
    metrics = {
        "totalTourists": len(tourist_records),
        "safe": sum(1 for tourist in tourist_records if tourist.get("status") == "safe"),
        "warning": sum(1 for tourist in tourist_records if tourist.get("status") == "warning"),
        "emergency": sum(1 for tourist in tourist_records if tourist.get("status") == "emergency"),
        "devicesOnline": sum(1 for device in wearable_records if device.get("connected") or device.get("status") == "online"),
        "devicesActive": sum(1 for device in wearable_records if device.get("connected") or device.get("status") == "online"),
        "devicesTotal": len(wearable_records),
        "activeAlerts": len(active_alerts),
        "primaryTourist": tourist_records[0] if tourist_records else {},
    }
    markers = [
        {"id": tourist["id"], "lat": tourist["latitude"], "lng": tourist["longitude"], "status": tourist["status"], "label": tourist.get("location") or "Live device location", "touristId": tourist["id"], "touristName": tourist["name"], "heartRate": tourist.get("heart_rate"), "battery": tourist.get("battery"), "lastUpdate": tourist.get("last_updated")}
        for tourist in tourist_records
        if tourist.get("latitude") is not None and tourist.get("longitude") is not None
    ]
    return {"metrics": metrics, "tourists": tourist_records, "wearables": wearable_records, "alerts": [_to_dict(a) for a in alerts], "activities": [_to_dict(a) for a in activities], "analytics": analytics or {}, "mapMarkers": markers}
