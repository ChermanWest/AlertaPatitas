# Alerta Patitas

**Alerta Patitas** es una aplicación web diseñada para facilitar el reporte de mascotas perdidas y promover la colaboración entre la comunidad para agilizar su reencuentro con sus familias. La plataforma integra autenticación de usuarios, gestión de publicaciones, almacenamiento de imágenes y un sistema de búsqueda mediante filtros.

---

## Características

- Autenticación de usuarios mediante Supabase Auth.
- Creación, edición y administración de publicaciones.
- Carga y almacenamiento de fotografías en Supabase Storage.
- Búsqueda de publicaciones mediante filtros por:
  - Tipo de mascota
  - Sexo
  - Edad
  - Tamaño
  - Estado
  - Zona
- Vista detallada de cada publicación con URL compartible.
- Página institucional con información del equipo de desarrollo.

---

## Tecnologías utilizadas

- React
- Vite
- Supabase
  - Authentication
  - Database
  - Storage
- React Router

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd alerta-patitas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_project_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

Las credenciales se encuentran en:

**Supabase → Settings → API**

### 4. Ejecutar la aplicación

```bash
npm run dev
```

---

## Configuración de Supabase

Antes de iniciar la aplicación es necesario realizar la configuración inicial del proyecto.

### Storage

Crear un bucket llamado:

```
fotos-mascotas
```

y configurarlo como **Público (Public)**.

### Base de datos

Ejecutar el archivo:

```
supabase configuracion completa.sql
```

desde el **SQL Editor** de Supabase.

### Notificaciones (Opcional)

Para habilitar las notificaciones relacionadas con comentarios, ejecutar:

```
supabase notificacion de comentario.sql
```

### Confirmación de correo

Si la verificación por correo electrónico está habilitada en:

```
Authentication → Providers → Email
```

los usuarios deberán confirmar su dirección de correo antes de iniciar sesión.

---

## Estructura del proyecto

```text
src/
├── components/
├── context/
├── hooks/
├── lib/
├── pages/

public/
├── fotos-perfil/
└── assets/
```

---

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/login` | Inicio de sesión |
| `/registro` | Registro de usuarios |
| `/editor` | Creación y edición de publicaciones |
| `/publicacion/:id` | Detalle de una publicación |
| `/acerca-de-nosotros` | Información del proyecto |

---

## Recursos del proyecto

### Scripts SQL

- `supabase configuracion completa.sql`
- `supabase notificacion de comentario.sql`

### Recursos gráficos

---

## Prototipo

Diseño disponible en Figma:

> https://www.figma.com/design/yYHQuBHclo9Xzv5OayxkaA/Alerta-Patitas?node-id=0-1&p=f&t=K9AdaX3WKwzLHbZB-0

---

## Consideraciones

- Los recursos estáticos se sirven desde la carpeta `public/`.
- La aplicación utiliza React Router para la navegación.
- Supabase centraliza la autenticación, la base de datos y el almacenamiento de imágenes.

---

## Licencia

Este proyecto se distribuye únicamente con fines académicos y de demostración. Su uso, modificación o distribución deberá realizarse conforme a la licencia que adopte el proyecto.
