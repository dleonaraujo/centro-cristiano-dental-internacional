from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import Patient, Worker
from .serializers import PatientSerializer, WorkerSerializer, StatsSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer


@api_view(['GET'])
def stats_view(request):
    today = timezone.now().date()
    today_patients = Patient.objects.filter(created_at__date=today).count()
    total_patients = Patient.objects.count()
    active_workers = Worker.objects.count()
    
    stats = {
        'today': today_patients,
        'totalPatients': total_patients,
        'activeWorkers': active_workers
    }
    
    serializer = StatsSerializer(stats)
    return Response(serializer.data)
