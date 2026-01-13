from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClassroomViewSet, AnnouncementViewSet, AttendanceViewSet, GradeViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'announcements', AnnouncementViewSet, basename='announcements')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'grades', GradeViewSet, basename='grades')
router.register(r'', ClassroomViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
