from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('teacher',)
    
    def create(self, validated_data):
        validated_data['teacher'] = self.context['request'].user
        return super().create(validated_data)
