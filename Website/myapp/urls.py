from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('api/auth/register/', views.api_register, name='api_register'),
    path('api/auth/login/', views.api_login, name='api_login'),
]