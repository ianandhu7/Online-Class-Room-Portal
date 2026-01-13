import urllib.request
import json

def test_login(email, password):
    url = "http://localhost:8000/api/auth/login"
    # Testing with 'email' key
    data_email = json.dumps({
        "email": email,
        "password": password
    }).encode('utf-8')

    # Testing with 'username' key
    data_username = json.dumps({
        "username": email,
        "password": password
    }).encode('utf-8')

    def make_request(data, label):
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req) as response:
                print(f"[{label}] Status: {response.getcode()}")
                print(f"[{label}] Content: {response.read().decode()}")
        except Exception as e:
            print(f"[{label}] Error: {e}")
            if hasattr(e, 'read'):
                print(f"[{label}] Details: {e.read().decode()}")

    make_request(data_email, "Using 'email' key")
    make_request(data_username, "Using 'username' key")

# I registered this email in the previous test
test_login("anandhuviju7@gmail.com", "password123")
