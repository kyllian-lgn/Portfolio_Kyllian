"""Backend API tests for Kyllian portfolio."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Read from frontend/.env as fallback
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
    except Exception:
        pass

API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "kyllian2026"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/portfolio/login", json={"password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    tok = r.json().get("token")
    assert tok
    return tok


@pytest.fixture
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ----------- Public content / settings -----------
class TestPublicContent:
    def test_get_content_shape(self):
        r = requests.get(f"{API}/portfolio/content", timeout=15)
        assert r.status_code == 200
        d = r.json()
        # hero
        assert d["hero"]["firstName"] == "Kyllian"
        assert d["hero"]["lastName"] == "Le Guen"
        # 6 projects, 6 education, 4 experiences
        assert len(d["projects"]) == 6
        assert len(d["education"]) == 6
        assert len(d["experiences"]) == 4
        # skills + passions + contact
        assert "software" in d["skills"]
        assert "sports" in d["passions"]
        assert d["contact"]["email"] == "kyllian.leguen55@orange.fr"

    def test_get_settings_defaults(self):
        r = requests.get(f"{API}/portfolio/settings", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["headingFont"] == "Syne"
        assert d["bodyFont"] == "Inter"
        assert d["accentColor"] == "#FF7A1A"


# ----------- Auth -----------
class TestAuth:
    def test_login_wrong_password(self):
        r = requests.post(f"{API}/portfolio/login", json={"password": "wrong"}, timeout=15)
        assert r.status_code == 401

    def test_login_correct_password(self):
        r = requests.post(f"{API}/portfolio/login", json={"password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json().get("token"), str)

    def test_verify_with_token(self, auth_headers):
        r = requests.get(f"{API}/portfolio/verify", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_verify_without_token(self):
        r = requests.get(f"{API}/portfolio/verify", timeout=15)
        assert r.status_code == 401

    def test_update_content_unauthorized(self):
        r = requests.put(f"{API}/portfolio/content", json={"foo": "bar"}, timeout=15)
        assert r.status_code == 401


# ----------- Admin content/settings flows -----------
class TestAdminContent:
    def test_update_then_reset_content(self, auth_headers):
        # GET current
        cur = requests.get(f"{API}/portfolio/content", timeout=15).json()
        original_title = cur["hero"]["subtitle"]
        modified = {**cur, "hero": {**cur["hero"], "subtitle": "TEST_subtitle"}}
        r = requests.put(f"{API}/portfolio/content", json=modified, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        # Verify
        after = requests.get(f"{API}/portfolio/content", timeout=15).json()
        assert after["hero"]["subtitle"] == "TEST_subtitle"
        # Reset
        r2 = requests.post(f"{API}/portfolio/content/reset", headers=auth_headers, timeout=15)
        assert r2.status_code == 200
        # Verify reset
        post_reset = requests.get(f"{API}/portfolio/content", timeout=15).json()
        assert post_reset["hero"]["subtitle"] != "TEST_subtitle"
        assert post_reset["hero"]["firstName"] == "Kyllian"

    def test_update_settings(self, auth_headers):
        new_settings = {"headingFont": "Syne", "bodyFont": "Inter", "accentColor": "#FF7A1A"}
        r = requests.put(f"{API}/portfolio/settings", json=new_settings, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        after = requests.get(f"{API}/portfolio/settings", timeout=15).json()
        assert after["accentColor"] == "#FF7A1A"

    def test_update_settings_unauthorized(self):
        r = requests.put(f"{API}/portfolio/settings", json={"headingFont": "X", "bodyFont": "Y", "accentColor": "#000"}, timeout=15)
        assert r.status_code == 401


# ----------- Contact + messages -----------
class TestContactAndMessages:
    msg_id = None

    def test_contact_submit_minimal(self):
        payload = {
            "lastName": "TEST_LeTesteur",
            "email": "test_kyllian@example.com",
            "message": "TEST message for portfolio testing.",
        }
        r = requests.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data.get("id")
        TestContactAndMessages.msg_id = data["id"]

    def test_contact_missing_required(self):
        r = requests.post(f"{API}/contact", json={"firstName": "x"}, timeout=15)
        assert r.status_code == 422

    def test_contact_invalid_email(self):
        r = requests.post(f"{API}/contact", json={"lastName": "X", "email": "notanemail", "message": "y"}, timeout=15)
        assert r.status_code == 422

    def test_list_messages_requires_auth(self):
        r = requests.get(f"{API}/admin/messages", timeout=15)
        assert r.status_code == 401

    def test_list_messages_contains_submitted(self, auth_headers):
        r = requests.get(f"{API}/admin/messages", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        msgs = r.json()
        assert isinstance(msgs, list)
        assert any(m["id"] == TestContactAndMessages.msg_id for m in msgs)

    def test_mark_read_then_delete(self, auth_headers):
        assert TestContactAndMessages.msg_id
        mid = TestContactAndMessages.msg_id
        r = requests.patch(f"{API}/admin/messages/{mid}/read", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        # verify read flag
        msgs = requests.get(f"{API}/admin/messages", headers=auth_headers, timeout=15).json()
        target = next((m for m in msgs if m["id"] == mid), None)
        assert target is not None
        assert target["read"] is True
        # delete
        r2 = requests.delete(f"{API}/admin/messages/{mid}", headers=auth_headers, timeout=15)
        assert r2.status_code == 200
        msgs2 = requests.get(f"{API}/admin/messages", headers=auth_headers, timeout=15).json()
        assert not any(m["id"] == mid for m in msgs2)


# ----------- Logout -----------
class TestLogout:
    def test_logout_revokes_token(self):
        r = requests.post(f"{API}/portfolio/login", json={"password": ADMIN_PASSWORD}, timeout=15)
        tok = r.json()["token"]
        headers = {"Authorization": f"Bearer {tok}"}
        # verify token works
        v = requests.get(f"{API}/portfolio/verify", headers=headers, timeout=15)
        assert v.status_code == 200
        # logout
        lo = requests.post(f"{API}/portfolio/logout", headers=headers, timeout=15)
        assert lo.status_code == 200
        # verify token rejected
        v2 = requests.get(f"{API}/portfolio/verify", headers=headers, timeout=15)
        assert v2.status_code == 401
