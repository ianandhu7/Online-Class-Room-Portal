import requests

# Test the CORS fix
backend_url = "https://classroom-portal-backend.onrender.com"

print("=== TESTING CORS FIX ===")

# Test OPTIONS request (preflight)
try:
    response = requests.options(f"{backend_url}/api/auth/register/", 
                               headers={
                                   'Origin': 'https://online-class-room-portal-1-tnym.onrender.com',
                                   'Access-Control-Request-Method': 'POST',
                                   'Access-Control-Request-Headers': 'Content-Type'
                               })
    print(f"OPTIONS Status: {response.status_code}")
    print(f"CORS Headers: {dict(response.headers)}")
    
    if 'Access-Control-Allow-Origin' in response.headers:
        print("✅ CORS headers present!")
    else:
        print("❌ CORS headers missing!")
        
except Exception as e:
    print(f"OPTIONS Error: {e}")

# Test actual POST request
try:
    data = {
        "name": "Test User",
        "email": "corstest@example.com",
        "password": "testpass123",
        "role": "student"
    }
    response = requests.post(f"{backend_url}/api/auth/register/", 
                           json=data,
                           headers={
                               'Origin': 'https://online-class-room-portal-1-tnym.onrender.com',
                               'Content-Type': 'application/json'
                           })
    print(f"\nPOST Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if 'Access-Control-Allow-Origin' in response.headers:
        print("✅ POST CORS headers present!")
    else:
        print("❌ POST CORS headers missing!")
        
except Exception as e:
    print(f"POST Error: {e}")