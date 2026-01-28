import requests
import json

backend = "https://online-classroom-portal-backend.onrender.com"

print("=== TESTING LOGIN DIRECTLY ===")

# Test login with the test credentials
login_data = {
    "email": "student@example.com",
    "password": "student123"
}

try:
    response = requests.post(f"{backend}/api/auth/login/", json=login_data, timeout=10)
    print(f"Login Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✅ Login successful!")
        data = response.json()
        if 'token' in data:
            print(f"Token received: {data['token'][:50]}...")
    else:
        print("❌ Login failed")
        
except Exception as e:
    print(f"Login Error: {e}")

print("\n=== TESTING REGISTRATION ===")

# Test registration
reg_data = {
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "testpass123",
    "role": "student"
}

try:
    response = requests.post(f"{backend}/api/auth/register/", json=reg_data, timeout=10)
    print(f"Registration Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("✅ Registration successful!")
    else:
        print("❌ Registration failed")
        
except Exception as e:
    print(f"Registration Error: {e}")

print("\n=== CHECKING BACKEND HEALTH ===")
try:
    response = requests.get(f"{backend}/", timeout=10)
    print(f"Backend Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Backend Response: {response.json()}")
except Exception as e:
    print(f"Backend Error: {e}")