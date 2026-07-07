from rest_framework import viewsets
from .models import Publicacion # <- Cambiado
from .serializers import PublicacionSerializer

class PublicacionViewSet(viewsets.ModelViewSet):
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer
