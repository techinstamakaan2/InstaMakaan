import urllib.request
import urllib.parse
import json

BASE_URL = "http://127.0.0.1:8000/api"
EMAIL = "admin@instamakaan.com"
PASSWORD = "Admin1234Makaan"

def run_tests():
    print("Testing Admin API Endpoints...")
    
    # 1. Login
    print("\n1. Logging in as Admin...")
    login_url = f"{BASE_URL}/auth/admin/auth/login"
    login_data = json.dumps({"email": EMAIL, "password": PASSWORD}).encode('utf-8')
    req = urllib.request.Request(login_url, data=login_data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status != 200:
                print(f"FAILED Login failed: {response.status}")
                return
            resp_body = response.read().decode('utf-8')
            token = json.loads(resp_body).get("access_token")
            print(f"SUCCESS Login successful. Received token.")
    except Exception as e:
        print(f"FAILED Login exception: {e}")
        return

    headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}
    
    endpoints = {
        "Dashboard Stats": "/dashboard/stats",
        "Properties": "/properties?limit=5",
        "Owners": "/owners?limit=5",
        "Agents": "/agents?limit=5",
        "Inquiries": "/inquiries/",
        "Blogs": "/blog?limit=5",
        "FAQs": "/faqs?limit=5",
    }
    
    for name, endpoint in endpoints.items():
        print(f"\nTesting {name} ({endpoint})...")
        req = urllib.request.Request(f"{BASE_URL}{endpoint}", headers=headers)
        try:
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    resp_body = response.read().decode('utf-8')
                    data = json.loads(resp_body)
                    if name == "Inquiries":
                        print("RAW INQUIRIES DATA:", json.dumps(data, indent=2))
                    if isinstance(data, list):
                        count = len(data)
                    elif isinstance(data, dict):
                        count = len(data.get("items", [])) if "items" in data else "data object"
                    else:
                        count = "unknown"
                    print(f"SUCCESS Retrieved {count} items.")
                else:
                    print(f"FAILED {response.status}")
        except urllib.error.HTTPError as e:
            print(f"FAILED HTTP Error {e.code}: {e.read().decode('utf-8')}")
        except Exception as e:
             print(f"FAILED Exception: {e}")

if __name__ == "__main__":
    run_tests()
