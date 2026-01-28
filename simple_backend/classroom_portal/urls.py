from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'message': 'Online Classroom Portal API is running'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', health_check),
    path('api/', include('api.urls')),
]