from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'patients', views.PatientViewSet, basename='patient')
router.register(r'workers', views.WorkerViewSet, basename='worker')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', views.stats_view, name='stats'),
]