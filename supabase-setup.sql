-- ============================================================
-- ALERTA PATITAS — Configuración de Supabase
-- Ejecuta esto en el SQL Editor de tu proyecto (supabase.com)
-- ============================================================


create table if not exists public.mascotas (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  mascota       text not null,
  sexo          text not null,
  tamano        text not null,
  edad          text,
  estado        text not null default 'buscando',
  descripcion   text,
  contacto      text,
  fotos         text[] default '{}',
  autor_id      uuid references auth.users(id) on delete set null,
  autor_correo  text,
  fecha         timestamptz not null default now()
);

-- ── 2. Row Level Security ──
alter table public.mascotas enable row level security;

-- Cualquiera (incluso sin sesión) puede ver las publicaciones.
create policy "mascotas_select_publico"
  on public.mascotas for select
  using (true);

-- Solo usuarios autenticados pueden crear, y únicamente a su propio nombre.
create policy "mascotas_insert_propio"
  on public.mascotas for insert
  to authenticated
  with check (auth.uid() = autor_id);

-- Solo el autor puede editar su publicación.
create policy "mascotas_update_propio"
  on public.mascotas for update
  to authenticated
  using (auth.uid() = autor_id)
  with check (auth.uid() = autor_id);

-- Solo el autor puede borrar su publicación.
create policy "mascotas_delete_propio"
  on public.mascotas for delete
  to authenticated
  using (auth.uid() = autor_id);


create policy "fotos_select_publico"
  on storage.objects for select
  using (bucket_id = 'fotos-mascotas');

create policy "fotos_insert_autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'fotos-mascotas');

create policy "fotos_update_delete_dueno"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'fotos-mascotas' and owner = auth.uid());

create policy "fotos_delete_dueno"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'fotos-mascotas' and owner = auth.uid());

-- ── 4. (Opcional) Migrar datos existentes ──
-- Si ya tenías datos en la vieja tabla "usuarios" con auth casera,
-- esa tabla queda obsoleta: ahora los usuarios viven en auth.users,
-- administrado por Supabase. Puedes eliminarla cuando ya no la
-- necesites:
--
-- drop table if exists public.usuarios;
--
-- Nota: si "mascotas.autor_correo" ya tenía datos con el esquema viejo,
-- probablemente autor_id apuntaba a ids numéricos que ya no existen.
-- Tendrás que resolver esa migración caso a caso (por correo, por
-- ejemplo) antes de aplicar las policies de arriba en un proyecto con
-- datos reales.
