from rest_framework import serializers
from .models import JobCard, JobPart
from inventory.serializers import PartSerializer

class JobPartSerializer(serializers.ModelSerializer):
    part_details = PartSerializer(source='part', read_only=True)

    class Meta:
        model = JobPart
        fields = ('id', 'job', 'part', 'part_details', 'quantity', 'price_at_use', 'total_cost')
        read_only_fields = ('price_at_use',)

class JobCardSerializer(serializers.ModelSerializer):
    parts_used = JobPartSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    mechanic_name = serializers.CharField(source='assigned_mechanic.username', read_only=True)

    class Meta:
        model = JobCard
        fields = '__all__'
