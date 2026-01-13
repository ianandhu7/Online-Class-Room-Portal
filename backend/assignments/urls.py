from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssignmentViewSet, SubmissionViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'submissions', SubmissionViewSet)
router.register(r'', AssignmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
