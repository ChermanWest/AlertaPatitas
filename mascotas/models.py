import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField

class Publicacion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100)
    mascota = models.CharField(max_length=50)
    sexo = models.CharField(max_length=20)
    edad = models.CharField(max_length=20, blank=True)
    tamano = models.CharField(max_length=20)
    estado = models.CharField(max_length=20, default='buscando')
    descripcion = models.TextField(blank=True)
    contacto = models.TextField(blank=True)
    fotos = ArrayField(models.TextField(), default=list, blank=True)
    autor_id = models.UUIDField(null=True, blank=True)
    autor_correo = models.EmailField(blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'publicaciones_alertapatitas'  # <- Nueva tabla limpia
        managed = True                             # <- Permite que Django la gestione

    def __str__(self):
        return self.nombre
