from django.db import models
from django.conf import settings

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    thumbnail = models.URLField(max_length=500, null=True, blank=True)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses_taught')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
