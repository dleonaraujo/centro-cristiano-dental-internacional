from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from .models import Patient, Worker
from .serializers import PatientSerializer, WorkerSerializer, StatsSerializer


class PatientViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar pacientes.
    Proporciona operaciones CRUD completas.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    def get_queryset(self):
        """
        Filtrar pacientes por tipo si se especifica
        """
        queryset = Patient.objects.all()
        patient_type = self.request.query_params.get('type', None)
        
        if patient_type:
            queryset = queryset.filter(type=patient_type)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def add_visit(self, request, pk=None):
        """
        Endpoint personalizado para agregar una visita
        """
        patient = self.get_object()
        patient.visits += 1
        patient.last_visit = timezone.now()
        patient.save()
        
        serializer = self.get_serializer(patient)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """
        Obtener pacientes recientes (últimos 30 días)
        """
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        recent_patients = Patient.objects.filter(created_at__gte=thirty_days_ago)
        
        serializer = self.get_serializer(recent_patients, many=True)
        return Response(serializer.data)


class WorkerViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar trabajadores.
    Proporciona operaciones CRUD completas.
    """
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    
    def get_queryset(self):
        """
        Filtrar trabajadores por rol si se especifica
        """
        queryset = Worker.objects.all()
        role = self.request.query_params.get('role', None)
        
        if role:
            queryset = queryset.filter(role=role)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def by_role(self, request):
        """
        Agrupar trabajadores por rol
        """
        roles = {}
        for role_code, role_name in Worker.ROLE_CHOICES:
            workers = Worker.objects.filter(role=role_code)
            roles[role_name] = WorkerSerializer(workers, many=True).data
        
        return Response(roles)


@api_view(['GET'])
def stats_view(request):
    """
    Endpoint para obtener estadísticas del sistema
    """
    # Pacientes atendidos hoy
    today = timezone.now().date()
    today_patients = Patient.objects.filter(
        created_at__date=today
    ).count()
    
    # Total de pacientes
    total_patients = Patient.objects.count()
    
    # Trabajadores activos
    active_workers = Worker.objects.count()
    
    stats = {
        'today': today_patients,
        'totalPatients': total_patients,
        'activeWorkers': active_workers
    }
    
    serializer = StatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
def patients_by_type(request, patient_type):
    """
    Obtener pacientes filtrados por tipo
    """
    if patient_type not in ['new', 'returning']:
        return Response(
            {'error': 'Tipo inválido. Use "new" o "returning"'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    patients = Patient.objects.filter(type=patient_type)
    serializer = PatientSerializer(patients, many=True)
    
    return Response({
        'type': patient_type,
        'count': patients.count(),
        'patients': serializer.data
    })