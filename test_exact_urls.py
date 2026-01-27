import requests

backend_url = "https://online-class-room-portal-backend.onrender.com"

# Test the exact URLs
urls_to_test = [
    f"{backend_url}/",
    f"{backend_url}/cors-test/",
    f"{backend_url}/api/auth/register/",
    f"{backend_url}/admin/",
]

for url in urls_to_test:
    try:
        response = requests.get(url, timeout=10)
        print(f"URL: {url}")
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        if response.status_code == 200:
            try:
                print(f"JSON: {response.json()}")
            except:
                print(f"Text: {response.text[:200]}...")
        else:
            print(f"Error: {response.text[:200]}...")
        print("-" * 50)
    except Exception as e:
        print(f"URL: {url}")
        print(f"Exception: {e}")
        print("-" * 50)