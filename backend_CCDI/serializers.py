from rest_framework import serializers
from .models import Patient, Worker


class PatientSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Patient"""
    
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Patient
        fields = [
            'id',
            'name',
            'phone',
            'email',
            'address',
            'type',
            'type_display',
            'visits',
            'last_visit',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_type(self, value):
        """Validación del tipo de paciente"""
        if value not in ['new', 'returning']:
            raise serializers.ValidationError(
                "El tipo debe ser 'new' o 'returning'"
            )
        return value


class WorkerSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Worker"""
    
    class Meta:
        model = Worker
        fields = [
            'id',
            'name',
            'role',
            'specialty',
            'phone',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_role(self, value):
        """Validación del rol"""
        valid_roles = ['Dentista', 'Asistente', 'Recepcionista', 'Administrador']
        if value not in valid_roles:
            raise serializers.ValidationError(
                f"El rol debe ser uno de: {', '.join(valid_roles)}"
            )
        return value


class StatsSerializer(serializers.Serializer):
    """Serializer para estadísticas"""
    today = serializers.IntegerField()
    totalPatients = serializers.IntegerField()
    activeWorkers = serializers.IntegerField()