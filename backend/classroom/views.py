from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Classroom, Enrollment, Announcement, Attendance, Grade
from .serializers import ClassroomSerializer, EnrollmentSerializer, AnnouncementSerializer, AttendanceSerializer, GradeSerializer

class GradeViewSet(viewsets.ModelViewSet):
    serializer_class = GradeSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Grade.objects.filter(classroom__teacher=user)
        return Grade.objects.filter(user=user)

class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Classroom.objects.filter(teacher=user)
        return Classroom.objects.filter(enrollments__user=user)

    @action(detail=False, methods=['post'])
    def join(self, request):
        code = request.data.get('code')
        try:
            classroom = Classroom.objects.get(code=code)
            Enrollment.objects.get_or_create(user=request.user, classroom=classroom)
            return Response(ClassroomSerializer(classroom).data)
        except Classroom.DoesNotExist:
            return Response({"error": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)

class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Announcement.objects.filter(classroom__teacher=user)
        return Announcement.objects.filter(classroom__enrollments__user=user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Attendance.objects.filter(classroom__teacher=user)
        return Attendance.objects.filter(user=user)
