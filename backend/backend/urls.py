from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

def home(request):
    return JsonResponse({
        "message": "Online Classroom Portal API is running successfully",
        "documentation": "/admin/",
        "version": "1.0.0",
        "status": "healthy"
    })

@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
def cors_test(request):
    response = JsonResponse({
        "message": "CORS test endpoint",
        "method": request.method,
        "origin": request.META.get('HTTP_ORIGIN', 'No origin header'),
        "headers": dict(request.headers)
    })
    
    # Manually add CORS headers for testing
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    
    return response

urlpatterns = [
    path('', home),
    path('cors-test/', cors_test),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    
    # Other app routes can be included here
    path('api/courses/', include('courses.urls')),
    path('api/classrooms/', include('classroom.urls')),
    path('api/assignments/', include('assignments.urls')),
    path('api/messages/', include('messaging.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
