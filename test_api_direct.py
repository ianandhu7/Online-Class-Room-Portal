import requests
import json

# Test the live backend API
backend_url = "https://online-class-room-portal-backend.onrender.com"

print("Testing backend API...")

# Test 1: Check if backend is responding
try:
    response = requests.get(f"{backend_url}/")
    print(f"✅ Backend Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"❌ Backend Error: {e}")

# Test 2: Check CORS test endpoint
try:
    response = requests.get(f"{backend_url}/cors-test/")
    print(f"✅ CORS Test: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"❌ CORS Test Error: {e}")

# Test 3: Try registration
try:
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpass123",
        "role": "student"
    }
    response = requests.post(f"{backend_url}/api/auth/register/", json=data)
    print(f"✅ Registration Test: {response.status_code}")
    if response.status_code == 201:
        print("Registration successful!")
    else:
        print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ Registration Error: {e}")