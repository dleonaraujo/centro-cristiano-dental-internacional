from django.db import models
from django.utils import timezone


class Patient(models.Model):
    TYPE_CHOICES = [
        ('new', 'Primera Vez'),
        ('returning', 'Recurrente'),
    ]
    
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    visits = models.IntegerField(default=1)
    last_visit = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class Worker(models.Model):
    ROLE_CHOICES = [
        ('Dentista', 'Dentista'),
        ('Asistente', 'Asistente'),
        ('Recepcionista', 'Recepcionista'),
        ('Administrador', 'Administrador'),
    ]
    
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    specialty = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
