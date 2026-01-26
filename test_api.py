import urllib.request
import json

# Test with correct port 8000 (Django default)
url = "http://localhost:8000/api/auth/register"
data = json.dumps({
    "name": "Test User",
    "email": "testuser99@example.com",
    "password": "password123",
    "role": "student"
}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print(f"✅ Success! Status: {response.getcode()}")
        print(f"Response: {response.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"❌ HTTP Error {e.code}: {e.reason}")
    print(f"Details: {e.read().decode()}")
except Exception as e:
    print(f"❌ Error: {e}")
