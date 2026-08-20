from __future__ import annotations

import glob
import logging
import os
from typing import Any

logger = logging.getLogger("smarttour.firebase")

_firebase_app = None
_firestore_client = None
_is_initialized = False


def _find_service_account_path() -> str | None:
    # 1. Environment variables
    for env_k in ["FIREBASE_CREDENTIALS_PATH", "GOOGLE_APPLICATION_CREDENTIALS"]:
        val = os.getenv(env_k)
        if val and os.path.exists(val):
            return val

    # 2. Check current directory for any *firebase-adminsdk*.json file
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    matches = glob.glob(os.path.join(backend_dir, "*firebase-adminsdk*.json"))
    if matches:
        return matches[0]

    # 3. Default fallback
    default_p = os.path.join(backend_dir, "firebase_credentials.json")
    if os.path.exists(default_p):
        return default_p

    return None


def init_firebase() -> bool:
    """
    Initialize Firebase Admin SDK and Firestore client.
    """
    global _firebase_app, _firestore_client, _is_initialized
    if _is_initialized:
        return _firestore_client is not None

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        cred_path = _find_service_account_path()
        project_id = os.getenv("FIREBASE_PROJECT_ID") or os.getenv("NEXT_PUBLIC_FIREBASE_PROJECT_ID")

        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            _firebase_app = firebase_admin.initialize_app(cred, {"projectId": project_id} if project_id else None)
            logger.info("Firebase Admin initialized successfully using service account: %s", cred_path)
        elif project_id and os.getenv("FIREBASE_USE_APPLICATION_DEFAULT_CREDENTIALS") == "true":
            try:
                _firebase_app = firebase_admin.initialize_app(options={"projectId": project_id})
                logger.info("Firebase Admin initialized with project ID: %s", project_id)
            except Exception as e:
                logger.warning("Firebase Admin default init with project ID failed: %s", e)
                _is_initialized = True
                return False
        else:
            logger.info("Firebase Admin credentials not found. Operating in local mode; browser Firestore sync remains available.")
            _is_initialized = True
            return False

        _firestore_client = firestore.client()
        _is_initialized = True
        return True

    except ImportError:
        logger.info("firebase_admin package not installed. Operating in local mode.")
        _is_initialized = True
        return False
    except Exception as exc:
        logger.warning("Failed to initialize Firebase Admin: %s", exc)
        _is_initialized = True
        return False


def get_firestore_client():
    if not _is_initialized:
        init_firebase()
    return _firestore_client


def is_firebase_ready() -> bool:
    return get_firestore_client() is not None


def load_demo_state(tourist_id: str, device_id: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]] | None:
    """Load the single demo session from Firestore, if it has already been created."""
    db = get_firestore_client()
    if not db:
        return None

    try:
        tourist_snapshot = db.collection("tourists").document(tourist_id).get()
        device_snapshot = db.collection("devices").document(device_id).get()
        analytics_snapshot = db.collection("analytics").document(tourist_id).get()
        if not tourist_snapshot.exists or not device_snapshot.exists:
            return None
        tourist = tourist_snapshot.to_dict() or {}
        device = device_snapshot.to_dict() or {}
        analytics = analytics_snapshot.to_dict() if analytics_snapshot.exists else {}
        return [tourist], [device], [], [], analytics or {}
    except Exception as exc:
        logger.warning("Failed to load demo state from Firestore: %s", exc)
        return None


def sync_tourists_to_firestore(tourists: list[Any]) -> bool:
    db = get_firestore_client()
    if not db:
        return False

    try:
        batch = db.batch()
        for tourist in tourists:
            data = tourist if isinstance(tourist, dict) else (tourist.__dict__ if hasattr(tourist, "__dict__") else dict(tourist))
            tid = str(data.get("id"))
            if not tid:
                continue
            doc_ref = db.collection("tourists").document(tid)
            batch.set(doc_ref, data, merge=True)
        batch.commit()
        return True
    except Exception as exc:
        logger.warning("Failed to sync tourists to Firestore: %s", exc)
        return False


def sync_wearables_to_firestore(wearables: list[Any]) -> bool:
    db = get_firestore_client()
    if not db:
        return False

    try:
        batch = db.batch()
        for w in wearables:
            data = w if isinstance(w, dict) else (w.__dict__ if hasattr(w, "__dict__") else dict(w))
            wid = str(data.get("id") or data.get("deviceId"))
            if not wid:
                continue
            doc_ref = db.collection("devices").document(wid)
            batch.set(doc_ref, data, merge=True)
        batch.commit()
        return True
    except Exception as exc:
        logger.warning("Failed to sync wearables to Firestore: %s", exc)
        return False


def sync_alerts_to_firestore(alerts: list[Any]) -> bool:
    db = get_firestore_client()
    if not db:
        return False

    try:
        batch = db.batch()
        for alert in alerts:
            data = alert if isinstance(alert, dict) else (alert.__dict__ if hasattr(alert, "__dict__") else dict(alert))
            aid = str(data.get("id"))
            if not aid:
                continue
            doc_ref = db.collection("alerts").document(aid)
            batch.set(doc_ref, data, merge=True)
        batch.commit()
        return True
    except Exception as exc:
        logger.warning("Failed to sync alerts to Firestore: %s", exc)
        return False


def sync_activities_to_firestore(activities: list[Any]) -> bool:
    db = get_firestore_client()
    if not db:
        return False

    try:
        batch = db.batch()
        for act in activities:
            data = act if isinstance(act, dict) else (act.__dict__ if hasattr(act, "__dict__") else dict(act))
            aid = str(data.get("id"))
            if not aid:
                continue
            doc_ref = db.collection("activities").document(aid)
            batch.set(doc_ref, data, merge=True)
        batch.commit()
        return True
    except Exception as exc:
        logger.warning("Failed to sync activities to Firestore: %s", exc)
        return False


def sync_analytics_to_firestore(analytics: dict[str, Any]) -> bool:
    db = get_firestore_client()
    if not db or not analytics:
        return False

    try:
        tid = analytics.get("tourist_id", "T-DEMO-01")
        doc_ref = db.collection("analytics").document(tid)
        doc_ref.set(analytics, merge=True)
        return True
    except Exception as exc:
        logger.warning("Failed to sync analytics to Firestore: %s", exc)
        return False


def sync_dashboard_state(tourists: list[Any], alerts: list[Any], activities: list[Any], wearables: list[Any] = None, analytics: dict[str, Any] = None) -> bool:
    if not is_firebase_ready():
        return False

    s1 = sync_tourists_to_firestore(tourists)
    s2 = sync_alerts_to_firestore(alerts)
    s3 = sync_activities_to_firestore(activities)
    s4 = sync_wearables_to_firestore(wearables) if wearables else True
    s5 = sync_analytics_to_firestore(analytics) if analytics else True
    return s1 or s2 or s3 or s4 or s5
