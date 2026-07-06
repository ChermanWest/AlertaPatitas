# Migración Alerta Patitas → Supabase PostgreSQL

## Qué cambia y qué NO cambia

| Antes (Apps Script)          | Después (Supabase)             |
|------------------------------|-------------------------------|
| Google Sheets "Hoja 1"       | Tabla `mascotas` en PostgreSQL |
| Google Sheets "Usuarios"     | Tabla `usuarios` en PostgreSQL |
| Google Drive (fotos en base64)| Supabase Storage (bucket `fotos-mascotas`) |
| `API_URL` en cada JS         | `SUPABASE_URL` + `SUPABASE_ANON_KEY` en `supabase.js` |
| `loader.js` llama a /exec    | `loader.js` llama a REST API de Supabase |
| `editor.js` manda base64     | `editor.js` sube archivos directos a Storage |

Lo que NO cambia: todo el HTML, auth.css, home.css, editor1.css,
la lógica de la galería, los filtros, y la estructura de las páginas.

---

## PASO 1 — Crear el proyecto Supabase

1. Ve a https://supabase.com → "New project"
2. Nombre: `alerta-patitas`
3. Region: South America (São Paulo)
4. Guarda la contraseña de la base de datos

---

## PASO 2 — Crear las tablas y el Storage

1. En tu proyecto de Supabase → **SQL Editor** → **New query**
2. Pega TODO el contenido de `1_schema.sql`
3. Haz clic en **Run**
4. Deberías ver al final: dos filas con `usuarios | 0` y `mascotas | 0`

---

## PASO 3 — Obtener tus credenciales

1. En Supabase → **Settings** (engranaje) → **API**
2. Copia:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public** key → el JWT largo
3. Abre `supabase.js` y reemplaza:
   ```js
   const SUPABASE_URL      = 'https://abcdefgh.supabase.co';   // tu URL
   const SUPABASE_ANON_KEY = 'eyJhbGci...';                    // tu anon key
   ```

---

## PASO 4 — Reemplazar los archivos JS en tu proyecto

Copia estos archivos nuevos a tu carpeta del proyecto
(reemplazando los anteriores):

| Archivo nuevo          | Reemplaza a               |
|------------------------|--------------------------|
| `supabase.js`          | (nuevo, agregar)          |
| `auth.js`              | `auth.js` anterior        |
| `loader.js`            | `loader.js` anterior      |
| `editor.js`            | `editor.js` anterior      |
| `filters.js`           | `filters.js` anterior     |
| `login.html`           | `login.html` anterior     |

---

## PASO 5 — Agregar supabase.js a cada HTML

En **home.html**, **editor1.html** y **login.html** (y cualquier otra página
que use auth.js, loader.js, editor.js o filters.js), agrega esta línea
**ANTES** de los otros scripts:

```html
<script src="supabase.js"></script>
```

Ejemplo en home.html:
```html
  <script src="supabase.js"></script>   ← NUEVO, primero
  <script src="auth.js"></script>
  <script src="filters.js"></script>
</body>
```

---

## PASO 6 — (Opcional) Migrar datos existentes del Sheet

Si tienes publicaciones en Google Sheets que quieres conservar:

1. En Google Sheets → Archivo → Descargar → CSV
2. En Supabase → **Table Editor** → tabla `mascotas` → **Insert** → **Import CSV**
3. Ajusta los nombres de columnas si es necesario (tamano vs tamaño)

Para las fotos existentes en Google Drive: no se pueden migrar
automáticamente. Las fotos nuevas que se suban desde ahora
irán directamente a Supabase Storage.

---

## PASO 7 — Verificar que funciona

1. Abre `login.html` en tu navegador
2. Ve a registro e intenta crear un usuario
3. En Supabase → Table Editor → `usuarios` — deberías ver la fila nueva
4. Intenta iniciar sesión
5. Ve a `editor1.html` y crea una publicación con foto
6. En Supabase → Table Editor → `mascotas` — deberías ver la publicación
7. En Supabase → Storage → `fotos-mascotas` — deberías ver la foto

---

## Notas importantes

- **No necesitas Apps Script ni Google Sheets** para nada después de esta migración.
- Las contraseñas siguen siendo SHA-256 + salt, igual que antes. Son compatibles si migras usuarios del Sheet.
- El plan gratuito de Supabase incluye: 500 MB de base de datos, 1 GB de Storage, 50.000 peticiones/mes. Más que suficiente para empezar.
- Si en el futuro quieres más seguridad, puedes migrar a Supabase Auth (su sistema de autenticación propio), pero eso requeriría cambios más grandes.
