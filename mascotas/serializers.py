from rest_framework import serializers
from .models import Publicacion

class PublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = '__all__'
        # Añade esto para que DRF no pida el campo 'autor' en el JSON del frontend:
        read_only_fields = ['autor']