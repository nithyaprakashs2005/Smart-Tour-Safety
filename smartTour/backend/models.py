from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

TouristStatus = Literal["safe", "warning", "emergency"]
AlertSeverity = Literal["critical", "high", "medium", "low"]
AlertStatus = Literal["active", "acknowledged", "resolved"]


@dataclass
class Tourist:
    id: str
    name: str
    status: TouristStatus
    latitude: float
    longitude: float
    heart_rate: int | None = None
    battery: int = 100
    activity: str = "Walking"
    risk_score: int = 10
    wearable_id: str = ""
    last_updated: str = ""
    location: str = ""
    email: str = ""
    phone: str = ""
    group: str = "Alpha"


@dataclass
class Wearable:
    id: str
    tourist_id: str
    status: str
    battery: int
    last_seen: str
    signal: int
    connected: bool
    sensor_status: str


@dataclass
class Alert:
    id: str
    tourist_id: str
    type: str
    severity: AlertSeverity
    status: AlertStatus
    timestamp: str
    message: str
    location: str
    latitude: float
    longitude: float
    heart_rate: int | None = None
    battery: int | None = None


@dataclass
class ActivityEntry:
    id: str
    tourist_id: str
    event: str
    location: str
    timestamp: str
    status: str


@dataclass
class AnalyticsSnapshot:
    alerts_over_time: list[dict]
    emergency_types: list[dict]
    activity_summary: list[dict]
    risk_distribution: list[dict]
    response_time: float
    wearable_uptime: float
    heart_rate_trend: list[dict]


@dataclass
class StoreState:
    tourists: list[Tourist] = field(default_factory=list)
    wearables: list[Wearable] = field(default_factory=list)
    alerts: list[Alert] = field(default_factory=list)
    activities: list[ActivityEntry] = field(default_factory=list)
    analytics: AnalyticsSnapshot | None = None
