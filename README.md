# Alerta Patitas

Aplicación web para reportar mascotas perdidas, recibir ayuda de la comunidad y facilitar su reencuentro con sus familias. El proyecto está desarrollado con React, Vite y Supabase.

## Qué incluye

- Registro e inicio de sesión con Supabase Auth
- Publicación y edición de mascotas perdidas
- Subida de fotos a Supabase Storage
- Filtros por tipo, sexo, edad, tamaño, estado y zona
- Vista detallada de cada publicación con URL compartible
- Página “Acerca de nosotros” con los integrantes del equipo



## Instalación y ejecución

1. Instala las dependencias:

```bash
npm install
```

2. Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=tu_project_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

3. Inicia el proyecto:

```bash
npm run dev
```

Las credenciales las encuentras en Supabase → Settings → API.

## Configuración de Supabase

Antes de usar la app, asegúrate de configurar lo siguiente:

1. Crear un bucket llamado `fotos-mascotas` y marcarlo como público.
2. Ejecutar el script SQL de configuración en el SQL Editor de Supabase.
3. Si quieres habilitar notificaciones relacionadas con comentarios, ejecutar también el script correspondiente.

Si la confirmación de correo está activada en Auth → Providers → Email, los usuarios deberán confirmar su correo antes de iniciar sesión.

## Estructura del proyecto

```text
src/
  components/         → Header, Footer, Filters, Gallery, PetCard, Popup
  context/            → AuthContext para sesión y autenticación
  hooks/              → useMascotas para consultar publicaciones
  lib/                → cliente de Supabase
  pages/              → Home, Login, Register, Editor, PublicationDetail, AcercaDeNosotros
public/               → assets estáticos y recursos públicos
```

## Rutas principales

- `/` → Inicio
- `/login` → Iniciar sesión
- `/registro` → Crear cuenta
- `/editor` → Crear o editar publicación
- `/publicacion/:id` → Detalle de una mascota
- `/acerca-de-nosotros` → Página del equipo

## Archivos de apoyo

- `supabase configuracion completa.sql` → estructura de la base de datos y políticas de acceso
- `supabase notificacion de comentario.sql` → lógica adicional para notificaciones
- `readme-descripcion/` → capturas del proyecto para referencia visual

## Notas importantes

- Las imágenes de la app se sirven desde la carpeta `public/`.
- Las fotos del equipo pueden guardarse en una carpeta como `public/fotos-perfil/` y referenciarlas desde la página de Acerca de nosotros.
- La app usa React Router para la navegación y Supabase para autenticación, almacenamiento y consulta de datos.

## Prototipo y diseño

Prototipo base en Figma:

https://www.figma.com/design/yYHQuBHclo9Xzv5OayxkaA/Alerta-Patitas?node-id=0-1&p=f&t=K9AdaX3WKwzLHbZB-0

Capturas del diseño:

- Inicio: [home.png](readme-descripcion/home.png)
- Iniciar sesión: [inicar sesion.png](readme-descripcion/inicar%20sesion.png)
- Editor: [editor.png](readme-descripcion/editor.png)
- Repositorio: [repositorio .png](readme-descripcion/repositorio%20.png)

