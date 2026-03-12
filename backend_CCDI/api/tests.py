from django.test import TestCase
from django.db import models
from django.utils import timezone


class Patient(models.Model):
    TYPE_CHOICES = [
        ('new', 'Primera Vez'),
        ('returning', 'Recurrente'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='Nombre Completo')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Teléfono')
    email = models.EmailField(blank=True, verbose_name='Email')
    address = models.TextField(blank=True, verbose_name='Dirección')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name='Tipo')
    visits = models.IntegerField(default=1, verbose_name='Visitas')
    last_visit = models.DateField(default=timezone.now, verbose_name='Última Visita')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Paciente'
        verbose_name_plural = 'Pacientes'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_type_display()}"


class Worker(models.Model):
    ROLE_CHOICES = [
        ('Dentista', 'Dentista'),
        ('Asistente', 'Asistente'),
        ('Recepcionista', 'Recepcionista'),
        ('Administrador', 'Administrador'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='Nombre')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, verbose_name='Cargo')
    specialty = models.CharField(max_length=100, blank=True, verbose_name='Especialidad')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Teléfono')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Trabajador'
        verbose_name_plural = 'Trabajadores'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.role}"
