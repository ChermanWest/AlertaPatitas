from django.shortcuts import render
from rest_framework import viewsets
from .models import Publicacion
from .serializers import PublicacionSerializer
# Create your views here.

class PublicacionViewSet(viewsets.ModelViewSet):
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer