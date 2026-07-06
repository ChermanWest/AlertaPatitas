# Alerta Patitas — versión React

Migración del sitio (HTML + JS suelto) a React + Vite, con Supabase arreglado de punta a punta.

## 1. Instalar y correr

```bash
npm install
cp .env.example .env      # y completa VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npm run dev
```

Vas a encontrar las credenciales en tu proyecto de supabase.com → **Settings → API**
("Project URL" y "anon public key").

## 2. Recuperar tus estilos e imágenes

No se migró el CSS a propósito. Para que la app se vea igual que antes:

1. Copia `home.css`, `auth.css` (y los que uses) dentro de `src/styles/` e impórtalos en
   `src/main.jsx` (ahí quedó el comentario indicando dónde).
2. Copia el contenido de tu carpeta `dist/` (imágenes, íconos) dentro de `public/dist/`.

Todas las clases (`.pet-card`, `.auth-input`, `.btn-publish`, `.filters`, `.login-dropdown`,
etc.) se dejaron **exactamente iguales** en los componentes para que tu CSS aplique sin tocar
nada más.

## 3. Configurar Supabase

Corre `supabase-setup.sql` en el **SQL Editor** de tu proyecto. Crea:

- la tabla `mascotas` (con `autor_id` apuntando a `auth.users`, no a una tabla propia),
- las políticas de RLS para que cada quien solo pueda editar/borrar sus propias publicaciones,
- las políticas de Storage para el bucket `fotos-mascotas`.

Antes de correr el script, crea el bucket desde el Dashboard: **Storage → New bucket →
`fotos-mascotas` → marca "Public bucket"**.

Si tu proyecto tiene activa la confirmación de correo (**Auth → Providers → Email → "Confirm
email"**), quien se registre va a necesitar confirmar su correo antes de poder iniciar sesión
— la app ya avisa eso en el mensaje de éxito del registro. Si prefieres que el login quede
activo al toque, puedes desactivar esa opción mientras desarrollas.

## 4. Qué se arregló respecto al código original

### Autenticación (el cambio más importante)

El `auth.js`/`supabase.js` original armaba su propio sistema de cuentas: guardaba
`password_hash` + `salt` en una tabla `usuarios` propia, hasheando con SHA-256 **en el
navegador**, y esa tabla se consultaba con la misma `anon key` pública que usa todo el sitio.
Eso significa que, sin políticas de RLS muy cuidadosas, cualquiera con la anon key podía pedir
`/rest/v1/usuarios?select=password_hash,salt` y quedarse con los hashes de todos los usuarios.

Ahora se usa **Supabase Auth** (`supabase.auth.signUp` / `signInWithPassword` / `signOut`):
las contraseñas nunca se guardan en una tabla tuya, la verificación pasa por el servidor de
Supabase, y la sesión (JWT) es la que permite que las políticas de RLS (`auth.uid()`)
funcionen tanto en `mascotas` como en Storage.

### Registro estaba roto

`registro.html` llamaba a `fetch(AUTH_API_URL, ...)`, pero `AUTH_API_URL` **no estaba definido
en ningún archivo**, y además mandaba los campos como `{ nombre, correo, contrasena }` mientras
que la función real `registrarUsuario({ nick, email, password })` de `auth.js` esperaba otros
nombres. En la práctica, crear una cuenta nunca funcionó con ese HTML. Ya quedó resuelto:
`Register.jsx` llama directo a `registrar()` del `AuthContext` con los nombres correctos.

### Subida de fotos

`editor.js` subía las fotos a Storage con `fetch()` manual al endpoint REST. Ahora se usa
`supabase.storage.from('fotos-mascotas').upload(...)` del SDK oficial, con
`getPublicUrl()` para armar la URL pública — menos código y con los mismos manejos de error
que el resto del SDK.

### Links de publicaciones

`publicacion.html` recibía el registro completo codificado como JSON en la URL
(`?datos=%7B...%7D`), lo que generaba URLs kilométricas y se rompía con descripciones largas
o caracteres especiales. Ahora se navega a `/publicacion/:id` y `PublicationDetail.jsx` pide
el registro directo a Supabase por su `id` — URLs cortas, compartibles, y que no dependen de
lo que había en pantalla al hacer clic.

### Filtro por defecto ocultaba casi todo

En `home.html`, los checkboxes de "Perro", "Macho", "Mediano" y "Perdido" venían marcados de
fábrica, y `filters.js` aplicaba esos filtros apenas cargaba la página — es decir, la mayoría
de las publicaciones quedaban escondidas sin que nadie tocara nada. En `Filters.jsx` el estado
inicial no filtra nada; se muestran todas las mascotas hasta que la persona elige un filtro a
propósito.

### HTML roto en el editor

`editor1.html` tenía una etiqueta mal cerrada
(`<div class="accordion-info" 11 de Septiembre (El Roble)</div>`) que un navegador puede llegar
a "arreglar" solo de forma impredecible. Quedó corregida en `Editor.jsx`.

### Otros

- `loader.js` no estaba enlazado desde ningún HTML real (`home.html` solo cargaba
  `filters.js`) y duplicaba casi toda su lógica; quedó consolidado en el hook
  `useMascotas`.
- `script-galeria.js` tampoco estaba enlazado desde ningún `.html` de los que revisamos;
  su comportamiento (subir hasta 3 fotos, navegar con flechas) quedó consolidado en
  `components/Gallery.jsx`, que además es el que usa `editor.js`.
- Publicar una mascota ahora **exige sesión iniciada**. Antes se podía crear una publicación
  sin loguearse, y quedaba sin dueño real — nadie podía editarla después porque no había forma
  de emparejarla con ningún usuario.
- El escape manual de HTML (`esc()` en `publicacion.html`) ya no hace falta: React escapa
  automáticamente todo lo que se renderiza como texto.

## 5. Estructura del proyecto

```
src/
  lib/supabaseClient.js     → cliente oficial de Supabase (createClient)
  context/AuthContext.jsx   → sesión + signUp/signIn/signOut
  hooks/useMascotas.js      → trae publicaciones desde la tabla "mascotas"
  components/
    Header.jsx, Footer.jsx, Popup.jsx
    PetCard.jsx             → tarjeta de una publicación
    Filters.jsx             → filtros de la home
    Gallery.jsx             → galería de fotos del editor (hasta 3 fotos)
  pages/
    Home.jsx                → antes home.html + filters.js/loader.js
    Login.jsx                → antes login.html
    Register.jsx             → antes registro.html
    Editor.jsx                → antes index.html/editor1.html + editor.js
    PublicationDetail.jsx     → antes publicacion.html
  App.jsx, main.jsx
supabase-setup.sql          → esquema + políticas RLS + Storage
```

## 6. Rutas

| Ruta                     | Página              |
|---------------------------|---------------------|
| `/`                        | Home                |
| `/login`                   | Iniciar sesión      |
| `/registro`                | Crear cuenta        |
| `/editor`                  | Crear publicación   |
| `/editor?id=<uuid>`         | Editar publicación  |
| `/publicacion/:id`          | Detalle de mascota  |
