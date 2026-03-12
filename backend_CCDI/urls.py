"""
URLs de la API REST
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router para ViewSets
router = DefaultRouter()
router.register(r'patients', views.PatientViewSet, basename='patient')
router.register(r'workers', views.WorkerViewSet, basename='worker')

urlpatterns = [
    # URLs del router
    path('', include(router.urls)),
    
    # Estadísticas
    path('stats/', views.stats_view, name='stats'),
    
    # Endpoints adicionales personalizados
    path('patients/by-type//', 
         views.patients_by_type, 
         name='patients-by-type'),
]