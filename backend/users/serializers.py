from rest_framework import serializers
from .models import User

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'role', 'photo_url', 'password')
        extra_kwargs = {

            'password': {'write_only': True},
            'username': {'required': False}
        }
    
    def create(self, validated_data):
        # Auto-generate username from email if not provided
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email')
        
        user = User.objects.create_user(**validated_data)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'
    
    def validate(self, attrs):
        # Since USERNAME_FIELD is 'email', we need to handle it properly
        # The parent class expects 'username' but we use 'email'
        email = attrs.get('email') or attrs.get('username') or self.initial_data.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError('Email and password are required')
        
        # Try to authenticate using email as username
        from django.contrib.auth import authenticate
        user = authenticate(username=email, password=password)
        
        if user is None:
            raise serializers.ValidationError('No active account found with the given credentials')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled')
        
        # Create tokens manually
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'token': str(refresh.access_token),
            'user': UserSerializer(user).data
        }
        
        return data

