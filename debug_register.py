import urllib.request
import json
import uuid

def test_registration():
    url = "http://localhost:8000/api/auth/register"
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    data = json.dumps({
        "name": "Test User",
        "email": email,
        "password": "Password123!",
        "confirmPassword": "Password123!",
        "role": "student"
    }).encode('utf-8')
    
    print(f"Testing registration with email: {email}")
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status Code: {response.getcode()}")
            print(f"Response Body: {response.read().decode()}")
    except Exception as e:
        print(f"Error: {e}")
        if hasattr(e, 'read'):
            print(f"Response Body: {e.read().decode()}")

if __name__ == "__main__":
    test_registration()
