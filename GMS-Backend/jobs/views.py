from rest_framework import viewsets, serializers
from .models import JobCard, JobPart
from .serializers import JobCardSerializer, JobPartSerializer
from inventory.models import Part

class JobCardViewSet(viewsets.ModelViewSet):
    queryset = JobCard.objects.all()
    serializer_class = JobCardSerializer

class JobPartViewSet(viewsets.ModelViewSet):
    queryset = JobPart.objects.all()
    serializer_class = JobPartSerializer

    def perform_create(self, serializer):
        part = serializer.validated_data['part']
        quantity = serializer.validated_data.get('quantity', 1)

        if part.quantity < quantity:
            raise serializers.ValidationError(f"Insufficient stock for {part.name}. Available: {part.quantity}")

        part.quantity -= quantity
        part.save()
        serializer.save()

    def perform_destroy(self, instance):
        # Restock when deleted
        part = instance.part
        part.quantity += instance.quantity
        part.save()
        instance.delete()
