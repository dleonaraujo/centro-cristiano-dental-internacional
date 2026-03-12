from rest_framework import serializers
from .models import Patient, Worker


class PatientSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Patient
        fields = ['id', 'name', 'phone', 'email', 'address', 'type', 
                  'type_display', 'visits', 'last_visit', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class WorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = ['id', 'name', 'role', 'specialty', 'phone', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StatsSerializer(serializers.Serializer):
    today = serializers.IntegerField()
    totalPatients = serializers.IntegerField()
    activeWorkers = serializers.IntegerField()