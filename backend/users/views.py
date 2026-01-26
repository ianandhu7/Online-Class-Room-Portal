from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

from .models import User
from courses.models import Course
from classroom.models import Classroom, Enrollment, Attendance
from assignments.models import Assignment, Submission

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        print(f"Registration Request Data: {request.data}")
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                print(f"Registration Validation Errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            user = serializer.save()
            print(f"User saved: {user}")
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Registration Exception: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        if role is not None:
            queryset = queryset.filter(role=role)
        return queryset

class UserMessagingListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id)

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class GlobalStatsView(generics.RetrieveAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        return Response({
            'total_users': User.objects.count(),
            'total_courses': Course.objects.count(),
            'total_classrooms': Classroom.objects.count(),
            'total_assignments': Assignment.objects.count(),
            'pending_requests': 14,
        })

class TeacherStatsView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'teacher':
            return Response({'error': 'Only teachers can access these stats'}, status=403)
            
        return Response({
            'total_courses': Course.objects.filter(teacher=user).count(),
            'active_classrooms': Classroom.objects.filter(teacher=user).count(),
            'pending_submissions': Submission.objects.filter(assignment__classroom__teacher=user, grade__isnull=True).count(),
            'total_students': Enrollment.objects.filter(classroom__teacher=user).values('user').distinct().count(),
            'assignments_given': Assignment.objects.filter(classroom__teacher=user).count()
        })

class StudentStatsView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'student':
            return Response({'error': 'Only students can access these stats'}, status=403)
            
        enrollments = Enrollment.objects.filter(user=user)
        
        attendance_records = Attendance.objects.filter(user=user)
        total_days = attendance_records.count()
        present_days = attendance_records.filter(status='present').count()
        attendance_percentage = (present_days / total_days * 100) if total_days > 0 else 100
        
        return Response({
            'enrolled_courses': enrollments.count(),
            'pending_assignments': Assignment.objects.filter(classroom__enrollments__user=user).exclude(submissions__student=user).count(),
            'attendance': round(attendance_percentage, 1),
            'completed_courses': 0, # Placeholder
            'gpa': 3.8, # Placeholder
        })