from django.db import models

# Create your models here.
class Publicacion(models.Model):
    nombre = models.CharField(max_length=100)
    tipo_mascota = models.CharField(max_length=50)
    edad = models.IntegerField()
    sexo = models.CharField(max_length=20)
    tamano = models.CharField(max_length=20)
    imagen = models.ImageField(upload_to='mascotas/')
    zona = models.CharField(max_length=100)
    descripcion = models.TextField()
    estado = models.CharField(max_length=20)

    def __str__(self):
        return self.nombre