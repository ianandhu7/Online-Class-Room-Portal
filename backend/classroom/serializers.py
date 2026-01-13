from rest_framework import serializers
from .models import Classroom, Enrollment, Announcement, Attendance, Grade

class GradeSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')
    class Meta:
        model = Grade
        fields = '__all__'
from courses.serializers import CourseSerializer
from users.serializers import UserSerializer

class EnrollmentSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'user_detail', 'classroom', 'enrolled_at']
        read_only_fields = ('user',)

class ClassroomSerializer(serializers.ModelSerializer):
    course_detail = CourseSerializer(source='course', read_only=True)
    teacher = UserSerializer(read_only=True)
    enrollments = EnrollmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Classroom
        fields = ['id', 'name', 'section', 'code', 'course', 'course_detail', 'teacher', 'created_at', 'enrollments', 'assignments', 'announcements']
        read_only_fields = ('teacher', 'code')

    def create(self, validated_data):
        validated_data['teacher'] = self.context['request'].user
        return super().create(validated_data)
    
    def to_representation(self, instance):
        from assignments.serializers import AssignmentSerializer
        data = super().to_representation(instance)
        # Include assignments
        data['assignments'] = AssignmentSerializer(instance.assignments.all(), many=True).data
        data['createdAt'] = data.pop('created_at')
        # Remove announcements from this representation to avoid circular issues
        data.pop('announcements', None)
        return data

class AnnouncementSerializer(serializers.ModelSerializer):
    from users.serializers import UserSerializer
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'classroom', 'author', 'created_at']
        read_only_fields = ('author', 'created_at')
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['createdAt'] = data.pop('created_at')
        return data

class AttendanceSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')
    class Meta:
        model = Attendance
        fields = '__all__'
