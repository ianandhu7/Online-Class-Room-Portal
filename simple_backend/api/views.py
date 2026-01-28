from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def register(request):
    """Handle user registration"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name', '')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role', 'student')
            
            # Check if user exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
            
            # Create user
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name
            )
            
            return JsonResponse({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'name': user.first_name,
                    'role': role
                },
                'token': f'token-{user.id}'
            }, status=201)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def login(request):
    """Handle user login"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            # Authenticate user
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
                    'token': f'token-{user.id}'
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
                
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def me(request):
    """Handle user profile"""
    if request.method == 'GET':
        return JsonResponse({
            'id': 1,
            'username': 'demo@example.com',
            'email': 'demo@example.com',
            'name': 'Demo User',
            'role': 'student'
        })
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)