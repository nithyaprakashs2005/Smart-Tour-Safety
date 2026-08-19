from __future__ import annotations

from sqlalchemy import Column, Float, ForeignKey, Integer, String, Boolean, DateTime
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class TouristDB(Base):
    __tablename__ = "tourists"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    status = Column(String, default="safe")
    latitude = Column(Float)
    longitude = Column(Float)
    heart_rate = Column(Integer)
    battery = Column(Integer, default=100)
    activity = Column(String, default="Walking")
    risk_score = Column(Integer, default=10)
    wearable_id = Column(String)
    last_updated = Column(DateTime)
    location = Column(String)
    email = Column(String)
    phone = Column(String)
    group = Column(String, default="Alpha")

    wearables = relationship("WearableDB", back_populates="tourist")
    sensors = relationship("SensorReadingDB", back_populates="tourist")
    alerts = relationship("AlertDB", back_populates="tourist")


class WearableDB(Base):
    __tablename__ = "wearables"
    id = Column(String, primary_key=True)
    tourist_id = Column(String, ForeignKey("tourists.id"))
    status = Column(String, default="online")
    battery = Column(Integer, default=100)
    last_seen = Column(DateTime)
    signal = Column(Integer, default=100)
    connected = Column(Boolean, default=True)
    sensor_status = Column(String, default="healthy")

    tourist = relationship("TouristDB", back_populates="wearables")


class AlertDB(Base):
    __tablename__ = "alerts"
    id = Column(String, primary_key=True)
    tourist_id = Column(String, ForeignKey("tourists.id"))
    type = Column(String)
    severity = Column(String)
    status = Column(String)
    timestamp = Column(DateTime)
    message = Column(String)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    heart_rate = Column(Integer)
    battery = Column(Integer)

    tourist = relationship("TouristDB", back_populates="alerts")


class SensorReadingDB(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    tourist_id = Column(String, ForeignKey("tourists.id"))
    heart_rate = Column(Integer)
    temperature = Column(Float)
    longitude = Column(Float)
    latitude = Column(Float)
    activity = Column(String)
    timestamp = Column(DateTime)

    tourist = relationship("TouristDB", back_populates="sensors")


class RiskAssessmentDB(Base):
    __tablename__ = "risk_assessments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    tourist_id = Column(String, ForeignKey("tourists.id"))
    risk_score = Column(Integer)
    risk_level = Column(String)
    confidence = Column(Float)
    activity = Column(String)
    timestamp = Column(DateTime)


class ActivityLogDB(Base):
    __tablename__ = "activities"
    id = Column(String, primary_key=True)
    tourist_id = Column(String, ForeignKey("tourists.id"))
    event = Column(String)
    location = Column(String)
    timestamp = Column(DateTime)
    status = Column(String)
