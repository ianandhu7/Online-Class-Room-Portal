import requests

backend = "https://online-classroom-portal-backend.onrender.com"

print("=== DEBUGGING BACKEND ROUTES ===")

# Test all possible routes
routes_to_test = [
    "/",
    "/admin/",
    "/api/",
    "/api/auth/",
    "/api/auth/register/",
    "/cors-test/",
]

for route in routes_to_test:
    url = f"{backend}{route}"
    try:
        response = requests.get(url, timeout=10)
        print(f"GET {route} -> {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"    Response: {data}")
            except:
                print(f"    Text: {response.text[:100]}...")
        elif response.status_code == 405:
            print(f"    Method not allowed (endpoint exists)")
        elif response.status_code == 404:
            print(f"    Not found")
        else:
            print(f"    Status: {response.status_code}")
            
    except Exception as e:
        print(f"GET {route} -> ERROR: {e}")

print("\n=== TESTING POST TO REGISTER ===")
try:
    data = {"name": "Test", "email": "test@test.com", "password": "test123", "role": "student"}
    response = requests.post(f"{backend}/api/auth/register/", json=data, timeout=10)
    print(f"POST /api/auth/register/ -> {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"POST ERROR: {e}")