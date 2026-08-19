from __future__ import annotations

import logging
import os
from typing import Any

logger = logging.getLogger("smarttour.firebase")

_firebase_app = None
_firestore_client = None
_is_initialized = False


def init_firebase() -> bool:
    """
    Initialize Firebase Admin SDK and Firestore client.
    Looks for:
    1. FIREBASE_CREDENTIALS_PATH env var
    2. GOOGLE_APPLICATION_CREDENTIALS env var
    3. Default service account JSON in backend directory
    4. Project ID from FIREBASE_PROJECT_ID env var
    """
    global _firebase_app, _firestore_client, _is_initialized
    if _is_initialized:
        return _firestore_client is not None

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        cred_path = (
            os.getenv("FIREBASE_CREDENTIALS_PATH")
            or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            or os.path.join(os.path.dirname(__file__), "firebase_credentials.json")
        )

        project_id = os.getenv("FIREBASE_PROJECT_ID") or os.getenv("NEXT_PUBLIC_FIREBASE_PROJECT_ID")

        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            _firebase_app = firebase_admin.initialize_app(cred, {"projectId": project_id} if project_id else None)
            logger.info("Firebase Admin initialized successfully using service account JSON: %s", cred_path)
        elif project_id:
            # Initialize with project ID if running in GCP environment or test mode
            try:
                _firebase_app = firebase_admin.initialize_app(options={"projectId": project_id})
                logger.info("Firebase Admin initialized with project ID: %s", project_id)
            except Exception as e:
                logger.warning("Firebase Admin default init with project ID failed: %s", e)
                _is_initialized = True
                return False
        else:
            logger.info("Firebase credentials not found. Operating in local mode.")
            _is_initialized = True
            return False

        _firestore_client = firestore.client()
        _is_initialized = True
        return True

    except ImportError:
        logger.info("firebase_admin package not installed. Install with 'pip install firebase-admin' to enable cloud sync.")
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


def sync_tourists_to_firestore(tourists: list[Any]) -> bool:
    """
    Batch update live tourists in Firestore.
    """
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


def sync_alerts_to_firestore(alerts: list[Any]) -> bool:
    """
    Batch update active alerts in Firestore.
    """
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
    """
    Batch update activities in Firestore.
    """
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


def sync_dashboard_state(tourists: list[Any], alerts: list[Any], activities: list[Any]) -> bool:
    """
    Full telemetry state sync to Cloud Firestore.
    """
    if not is_firebase_ready():
        return False

    s1 = sync_tourists_to_firestore(tourists)
    s2 = sync_alerts_to_firestore(alerts)
    s3 = sync_activities_to_firestore(activities)
    return s1 or s2 or s3
