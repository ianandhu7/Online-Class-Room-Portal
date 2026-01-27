import requests

# Test the current backend configuration
backend_base = "https://online-classroom-portal-backend.onrender.com"

print("Testing current backend configuration...")

# Test different URL combinations
test_urls = [
    f"{backend_base}/",
    f"{backend_base}/api/",
    f"{backend_base}/api/auth/",
    f"{backend_base}/api/auth/register/",
    f"{backend_base}/auth/register/",
]

for url in test_urls:
    try:
        response = requests.get(url, timeout=10)
        print(f"✅ {url} -> {response.status_code}")
        if response.status_code == 200:
            try:
                print(f"   JSON: {response.json()}")
            except:
                print(f"   Text: {response.text[:100]}...")
        elif response.status_code == 405:
            print(f"   Method not allowed (endpoint exists)")
        elif response.status_code == 404:
            print(f"   Not found")
    except Exception as e:
        print(f"❌ {url} -> Error: {e}")

print("\n" + "="*50)
print("Testing actual registration...")

# Test registration
try:
    data = {
        "name": "Test User",
        "email": "test123@example.com",
        "password": "testpass123",
        "role": "student"
    }
    response = requests.post(f"{backend_base}/api/auth/register/", json=data)
    print(f"Registration: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Registration Error: {e}")