import jwt
import os
from django.contrib.auth.models import User
from django.utils.deprecation import MiddlewareMixin

class SupabaseAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            try:
                # CORRECCIÓN AQUÍ: Obtenemos el texto del token de forma segura
                parts = auth_header.split(' ')
                token = parts[1] 
                
                # Leemos la clave de Supabase desde tu archivo .env
                secret = os.getenv('SUPABASE_SECRET_KEY')
                
                # Decodificamos el JWT
                payload = jwt.decode(token, secret, algorithms=['HS256'], audience='authenticated')
                email = payload.get('email')

                if email:
                    # Buscamos o creamos al usuario reflejado en Django
                    user, created = User.objects.get_or_create(
                        username=email, 
                        defaults={'email': email}
                    )
                    request.user = user
                    print(f"🔓 [Supabase Auth] Usuario autenticado correctamente: {email}")
            except Exception as e:
                # Este print te mostrará en la terminal de Django qué está fallando exactamente
                print(f"❌ [Supabase Auth] Error de autenticación: {str(e)}")
                pass
