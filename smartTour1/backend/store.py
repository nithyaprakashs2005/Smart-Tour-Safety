from __future__ import annotations

from datetime import datetime, timezone


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _status_from_risk(score: int) -> str:
    if score >= 75:
        return "emergency"
    if score >= 40:
        return "warning"
    return "safe"


def make_seed_data():
    tourists = [
        {
            "id": "T001",
            "name": "Rahul Sharma",
            "status": "safe",
            "latitude": 30.72,
            "longitude": 79.48,
            "heart_rate": 78,
            "battery": 85,
            "activity": "Walking",
            "risk_score": 18,
            "wearable_id": "W-1001",
            "last_updated": iso_now(),
            "location": "Pine Trail, Sector 2",
            "email": "rahul.sharma@email.com",
            "phone": "+91 98765 43210",
            "group": "Alpha",
        },
        {
            "id": "T002",
            "name": "Ananya Patel",
            "status": "safe",
            "latitude": 30.68,
            "longitude": 79.50,
            "heart_rate": 72,
            "battery": 90,
            "activity": "Sightseeing",
            "risk_score": 12,
            "wearable_id": "W-1002",
            "last_updated": iso_now(),
            "location": "Lakeview Park",
            "email": "ananya.patel@email.com",
            "phone": "+91 98765 43212",
            "group": "Alpha",
        },
        {
            "id": "T018",
            "name": "Vikram Singh",
            "status": "warning",
            "latitude": 30.71,
            "longitude": 79.44,
            "heart_rate": 102,
            "battery": 45,
            "activity": "Hiking",
            "risk_score": 52,
            "wearable_id": "W-1018",
            "last_updated": iso_now(),
            "location": "Hill Top Trail, Checkpoint 3",
            "email": "vikram.singh@email.com",
            "phone": "+91 98765 43220",
            "group": "Beta",
        },
        {
            "id": "T024",
            "name": "Neha Verma",
            "status": "emergency",
            "latitude": 30.71,
            "longitude": 79.44,
            "heart_rate": 138,
            "battery": 76,
            "activity": "Fall Detected",
            "risk_score": 88,
            "wearable_id": "W-1024",
            "last_updated": iso_now(),
            "location": "Near Hill Top Trail",
            "email": "neha.verma@email.com",
            "phone": "+91 98765 43230",
            "group": "Gamma",
        },
        {
            "id": "T045",
            "name": "Arjun Mehta",
            "status": "emergency",
            "latitude": 30.65,
            "longitude": 79.47,
            "heart_rate": 145,
            "battery": 60,
            "activity": "SOS",
            "risk_score": 95,
            "wearable_id": "W-1045",
            "last_updated": iso_now(),
            "location": "River Side Camp, Zone B",
            "email": "arjun.mehta@email.com",
            "phone": "+91 98765 43260",
            "group": "Beta",
        },
    ]

    wearables = [
        {"id": "W-1001", "tourist_id": "T001", "status": "online", "battery": 85, "last_seen": iso_now(), "signal": 78, "connected": True, "sensor_status": "healthy"},
        {"id": "W-1002", "tourist_id": "T002", "status": "online", "battery": 90, "last_seen": iso_now(), "signal": 82, "connected": True, "sensor_status": "healthy"},
        {"id": "W-1018", "tourist_id": "T018", "status": "online", "battery": 45, "last_seen": iso_now(), "signal": 61, "connected": True, "sensor_status": "warning"},
        {"id": "W-1024", "tourist_id": "T024", "status": "online", "battery": 76, "last_seen": iso_now(), "signal": 47, "connected": True, "sensor_status": "emergency"},
        {"id": "W-1045", "tourist_id": "T045", "status": "online", "battery": 60, "last_seen": iso_now(), "signal": 39, "connected": True, "sensor_status": "emergency"},
    ]

    alerts = [
        {
            "id": "ALT-001",
            "tourist_id": "T024",
            "type": "FALL_DETECTED",
            "severity": "critical",
            "status": "active",
            "timestamp": iso_now(),
            "message": "Possible fall detected",
            "location": "Near Hill Top Trail",
            "latitude": 30.71,
            "longitude": 79.44,
            "heart_rate": 138,
            "battery": 76,
        },
        {
            "id": "ALT-002",
            "tourist_id": "T045",
            "type": "SOS_ACTIVATED",
            "severity": "critical",
            "status": "active",
            "timestamp": iso_now(),
            "message": "SOS button pressed",
            "location": "River Side Camp, Zone B",
            "latitude": 30.65,
            "longitude": 79.47,
            "heart_rate": 145,
            "battery": 60,
        },
        {
            "id": "ALT-003",
            "tourist_id": "T018",
            "type": "HIGH_HEART_RATE",
            "severity": "high",
            "status": "acknowledged",
            "timestamp": iso_now(),
            "message": "Elevated heart rate trend detected",
            "location": "Hill Top Trail, Checkpoint 3",
            "latitude": 30.71,
            "longitude": 79.44,
            "heart_rate": 102,
            "battery": 45,
        },
    ]

    activities = [
        {"id": "AC-001", "tourist_id": "T024", "event": "Fall detected", "location": "Near Hill Top Trail", "timestamp": iso_now(), "status": "emergency"},
        {"id": "AC-002", "tourist_id": "T018", "event": "Heart rate elevated", "location": "Hill Top Trail", "timestamp": iso_now(), "status": "warning"},
        {"id": "AC-003", "tourist_id": "T001", "event": "Back on route", "location": "Pine Trail", "timestamp": iso_now(), "status": "safe"},
    ]

    analytics = {
        "alerts_over_time": [{"date": "Mon", "alerts": 3}, {"date": "Tue", "alerts": 5}, {"date": "Wed", "alerts": 4}, {"date": "Thu", "alerts": 6}, {"date": "Fri", "alerts": 7}],
        "emergency_types": [{"name": "Fall", "value": 11}, {"name": "SOS", "value": 5}, {"name": "High HR", "value": 8}, {"name": "Geofence", "value": 4}],
        "activity_summary": [{"name": "Walking", "value": 42}, {"name": "Hiking", "value": 31}, {"name": "Resting", "value": 17}, {"name": "Emergency", "value": 10}],
        "risk_distribution": [{"name": "Safe", "value": 72}, {"name": "Warning", "value": 18}, {"name": "Emergency", "value": 10}],
        "response_time": 4.2,
        "wearable_uptime": 98.7,
        "heart_rate_trend": [{"time": "08:00", "value": 72}, {"time": "09:00", "value": 74}, {"time": "10:00", "value": 80}, {"time": "11:00", "value": 83}],
    }

    return tourists, wearables, alerts, activities, analytics


def _safe_status(value):
    return value if isinstance(value, str) else value.get("status") if isinstance(value, dict) else "safe"


def _to_dict(value):
    return value if isinstance(value, dict) else value.__dict__


def snapshot_to_dashboard(tourists, alerts, activities):
    total = len(tourists)
    safe_count = sum(1 for t in tourists if _safe_status(t) == "safe")
    warning_count = sum(1 for t in tourists if _safe_status(t) == "warning")
    emergency_count = sum(1 for t in tourists if _safe_status(t) == "emergency")
    active_alerts = [a for a in alerts if (a.get("status") if isinstance(a, dict) else a.status) in {"active", "acknowledged"}]
    metrics = {
        "totalTourists": total,
        "safe": safe_count,
        "warning": warning_count,
        "emergency": emergency_count,
        "devicesOnline": 96,
        "devicesActive": sum(1 for t in tourists if (t.get("battery") if isinstance(t, dict) else t.battery) > 0),
        "devicesTotal": total,
        "activeAlerts": len(active_alerts),
    }
    items = []
    for tourist in tourists:
        tourist_data = _to_dict(tourist)
        items.append({
            "id": tourist_data.get("id"),
            "lat": tourist_data.get("latitude"),
            "lng": tourist_data.get("longitude"),
            "status": tourist_data.get("status"),
            "label": tourist_data.get("location"),
            "touristId": tourist_data.get("id"),
            "touristName": tourist_data.get("name"),
            "heartRate": tourist_data.get("heart_rate"),
            "battery": tourist_data.get("battery"),
            "lastUpdate": tourist_data.get("last_updated"),
        })
    return {
        "metrics": metrics,
        "tourists": [_to_dict(t) for t in tourists],
        "alerts": [_to_dict(a) for a in alerts],
        "activities": [_to_dict(a) for a in activities],
        "mapMarkers": items,
    }
