from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

    def get_queryset(self):
        classroom_id = self.request.query_params.get('classroomId')
        if classroom_id:
            return Assignment.objects.filter(classroom_id=classroom_id)
        return Assignment.objects.all()

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        assignment = self.get_object()
        content = request.data.get('content')
        attachment = request.data.get('attachment')
        
        defaults = {'content': content}
        if attachment:
            defaults['attachment'] = attachment
            
        submission, created = Submission.objects.update_or_create(
            assignment=assignment,
            student=request.user,
            defaults=defaults
        )
        return Response(SubmissionSerializer(submission).data)

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Submission.objects.filter(student=user)
        elif user.role == 'teacher':
            return Submission.objects.filter(assignment__classroom__teacher=user)
        return Submission.objects.all()

    @action(detail=False, methods=['get'])
    def pending(self, request):
        user = request.user
        if user.role != 'teacher':
            return Response({"error": "Only teachers can view pending submissions"}, status=403)
        
        submissions = Submission.objects.filter(
            assignment__classroom__teacher=user,
            grade__isnull=True
        )
        return Response(SubmissionSerializer(submissions, many=True).data)

    @action(detail=True, methods=['post'])
    def grade(self, request, pk=None):
        submission = self.get_object()
        submission.grade = request.data.get('grade')
        submission.feedback = request.data.get('feedback')
        submission.save()
        return Response(SubmissionSerializer(submission).data)
