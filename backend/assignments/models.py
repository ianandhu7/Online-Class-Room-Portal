from django.db import models
from django.conf import settings
from classroom.models import Classroom

class Assignment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    points = models.IntegerField(default=100)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='assignments')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='published')

    def __str__(self):
        return self.title

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    content = models.TextField(null=True, blank=True)
    attachment = models.FileField(upload_to='submissions/', null=True, blank=True)
    grade = models.FloatField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('assignment', 'student')
