from django.contrib import admin
from .models import Patient, Worker


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    """Administración de Pacientes"""
    
    list_display = ['name', 'type', 'visits', 'last_visit', 'phone', 'created_at']
    list_filter = ['type', 'created_at', 'last_visit']
    search_fields = ['name', 'email', 'phone']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('name', 'phone', 'email', 'address')
        }),
        ('Información de Visitas', {
            'fields': ('type', 'visits', 'last_visit')
        }),
    )


@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):
    """Administración de Trabajadores"""
    
    list_display = ['name', 'role', 'specialty', 'phone', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['name', 'specialty', 'phone']
    ordering = ['name']
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('name', 'phone')
        }),
        ('Información Profesional', {
            'fields': ('role', 'specialty')
        }),
    )