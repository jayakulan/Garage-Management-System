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
        read_only_fields = ('customer',)

    def create(self, validated_data):
        # If no customer is provided, default to the request user if not an admin/mechanic creating for someone else
        request = self.context.get('request')
        if request and hasattr(request, 'user') and not validated_data.get('customer'):
            validated_data['customer'] = request.user
        return super().create(validated_data)
