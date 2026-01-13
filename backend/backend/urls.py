from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from users.views import RegisterView, UserProfileView, CustomTokenObtainPairView

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
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
