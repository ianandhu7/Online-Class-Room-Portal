from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User as DjangoUser
import json

# Use Django's built-in User model temporarily
def create_simple_user(username, password, email):
    """Create user with Django's built-in User model"""
    try:
        user = DjangoUser.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        return user
    except:
        return None

@csrf_exempt
def api_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name', '')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role', 'student')
            
            # Check if user exists
            if DjangoUser.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
            
            # Create user with built-in User model
            user = create_simple_user(email, password, email)
            if user:
                return JsonResponse({
                    'success': True,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'name': name,
                        'role': role
                    },
                    'token': 'dummy-token-for-now'
                }, status=201)
            else:
                return JsonResponse({'error': 'Failed to create user'}, status=500)
                
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            # Try to authenticate
            user = authenticate(username=email, password=password)
            if user:
                return JsonResponse({
                    'success': True,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'name': user.first_name or user.username,
                        'role': 'student'
                    },
                    'token': 'dummy-token-for-now'
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
                
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def home_view(request):
    return render(request, 'home.html')

