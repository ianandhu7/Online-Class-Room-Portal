import requests
import json

# Test the CORRECT backend URL from your dashboard
backend_url = "https://online-classroom-portal-backend.onrender.com"

print("Testing CORRECT backend URL...")

# Test 1: Home endpoint
try:
    response = requests.get(f"{backend_url}/")
    print(f"✅ Home: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
except Exception as e:
    print(f"❌ Home Error: {e}")

# Test 2: Registration endpoint
try:
    response = requests.get(f"{backend_url}/api/auth/register/")
    print(f"✅ Register endpoint: {response.status_code}")
    print(f"Response: {response.text[:100]}...")
except Exception as e:
    print(f"❌ Register Error: {e}")

# Test 3: Try actual registration
try:
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpass123",
        "role": "student"
    }
    response = requests.post(f"{backend_url}/api/auth/register/", json=data)
    print(f"✅ Registration: {response.status_code}")
    if response.status_code == 201:
        print("✅ Registration works!")
    else:
        print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ Registration Error: {e}")