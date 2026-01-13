from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, UserProfileView, CustomTokenObtainPairView, UserListView, GlobalStatsView, TeacherStatsView, StudentStatsView, UserMessagingListView, UserDetailView

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', CustomTokenObtainPairView.as_view(), name='login'),
    path('me', UserProfileView.as_view(), name='profile'),
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('users', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>', UserDetailView.as_view(), name='user-detail'),
    path('search-users', UserMessagingListView.as_view(), name='search-users'),
    path('stats', GlobalStatsView.as_view(), name='global-stats'),
    path('teacher-stats', TeacherStatsView.as_view(), name='teacher-stats'),
    path('student-stats', StudentStatsView.as_view(), name='student-stats'),
]
