from django.db import models
from django.conf import settings
from courses.models import Course
import random
import string

def generate_class_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))

class Classroom(models.Model):
    name = models.CharField(max_length=255)
    section = models.CharField(max_length=100, null=True, blank=True)
    code = models.CharField(max_length=10, unique=True, default=generate_class_code)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='classrooms')
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='classrooms_managed')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.section}"

class Enrollment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'classroom')

class Announcement(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='announcements')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Attendance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attendance_records')
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=[('present', 'Present'), ('absent', 'Absent'), ('late', 'Late')])
    
    class Meta:
        unique_together = ('user', 'classroom', 'date')

    def __str__(self):
        return f"{self.user.name or self.user.username} - {self.date} - {self.status}"

class Grade(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='grades')
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='grades')
    title = models.CharField(max_length=255)
    score = models.FloatField()
    max_score = models.FloatField(default=100)
    date = models.DateField(auto_now_add=True)
    grade_letter = models.CharField(max_length=5, null=True, blank=True)

    def __str__(self):
        return f"{self.user.name or self.user.username} - {self.title}: {self.score}/{self.max_score}"
