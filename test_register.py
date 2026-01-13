import urllib.request
import json
import uuid

def test_registration(email, name):
    url = "http://localhost:8000/api/auth/register"
    data = json.dumps({
        "name": name,
        "email": email,
        "password": "password123",
        "role": "student"
    }).encode('utf-8')

    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.getcode()}")
            print(f"Content: {response.read().decode()}")
    except Exception as e:
        print(f"Error: {e}")
        if hasattr(e, 'read'):
            print(f"Details: {e.read().decode()}")

print("--- Testing registration with user's email ---")
test_registration("anandhuviju7@gmail.com", "Anandhu Viju")

print("\n--- Testing registration with a fresh random email ---")
random_email = f"user_{uuid.uuid4().hex[:8]}@example.com"
test_registration(random_email, "Random User")
