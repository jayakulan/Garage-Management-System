from rest_framework import viewsets
from .models import JobCard, JobPart
from .serializers import JobCardSerializer, JobPartSerializer

class JobCardViewSet(viewsets.ModelViewSet):
    queryset = JobCard.objects.all()
    serializer_class = JobCardSerializer

class JobPartViewSet(viewsets.ModelViewSet):
    queryset = JobPart.objects.all()
    serializer_class = JobPartSerializer
