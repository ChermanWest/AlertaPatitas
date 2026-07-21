-- ============================================================
-- ALERTA PATITAS — Configuración completa de Supabase
-- Ejecuta esto en el SQL Editor de tu proyecto (supabase.com)
-- Este script es seguro de volver a ejecutar las veces que sea
-- necesario (usa IF NOT EXISTS / DROP POLICY IF EXISTS en todo).
-- ============================================================


-- ============================================================
-- 1. TABLA: mascotas
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

alter table public.mascotas enable row level security;

-- Cualquiera (incluso sin sesión) puede ver las publicaciones.
drop policy if exists "mascotas_select_publico" on public.mascotas;
create policy "mascotas_select_publico"
  on public.mascotas for select
  using (true);

-- Solo usuarios autenticados pueden crear, y únicamente a su propio nombre.
drop policy if exists "mascotas_insert_propio" on public.mascotas;
create policy "mascotas_insert_propio"
  on public.mascotas for insert
  to authenticated
  with check (auth.uid() = autor_id);

-- Solo el autor puede editar su publicación.
drop policy if exists "mascotas_update_propio" on public.mascotas;
create policy "mascotas_update_propio"
  on public.mascotas for update
  to authenticated
  using (auth.uid() = autor_id)
  with check (auth.uid() = autor_id);

-- Solo el autor puede borrar su publicación.
drop policy if exists "mascotas_delete_propio" on public.mascotas;
create policy "mascotas_delete_propio"
  on public.mascotas for delete
  to authenticated
  using (auth.uid() = autor_id);


-- Agrega la columna zona a mascotas (si no existe)
alter table public.mascotas
  add column if not exists zona text;

-- Opcional: acelera filtros por zona
create index if not exists mascotas_zona_idx
  on public.mascotas (zona);

-- ============================================================
-- 2. STORAGE: bucket de fotos
-- ============================================================
-- Crea el bucket "fotos-mascotas" desde el Dashboard
-- (Storage → New bucket → márcalo como "Public bucket")
-- antes de correr las policies de abajo.

drop policy if exists "fotos_select_publico" on storage.objects;
create policy "fotos_select_publico"
  on storage.objects for select
  using (bucket_id = 'fotos-mascotas');

drop policy if exists "fotos_insert_autenticado" on storage.objects;
create policy "fotos_insert_autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'fotos-mascotas');

drop policy if exists "fotos_update_delete_dueno" on storage.objects;
create policy "fotos_update_delete_dueno"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'fotos-mascotas' and owner = auth.uid());

drop policy if exists "fotos_delete_dueno" on storage.objects;
create policy "fotos_delete_dueno"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'fotos-mascotas' and owner = auth.uid());


-- ============================================================
-- 3. TABLA: comentarios
-- ============================================================

create table if not exists public.comentarios (
  id            uuid primary key default gen_random_uuid(),
  mascota_id    uuid not null references public.mascotas(id) on delete cascade,
  autor_id      uuid references auth.users(id) on delete set null,
  autor_nombre  text not null,
  texto         text not null,
  fecha         timestamptz not null default now()
);

create index if not exists comentarios_mascota_id_idx
  on public.comentarios (mascota_id);

alter table public.comentarios enable row level security;

-- Cualquiera puede leer los comentarios (igual que las publicaciones)
drop policy if exists "comentarios_select_publico" on public.comentarios;
create policy "comentarios_select_publico"
  on public.comentarios for select
  using (true);

-- Solo usuarios autenticados pueden comentar, y solo a su propio nombre
drop policy if exists "comentarios_insert_propio" on public.comentarios;
create policy "comentarios_insert_propio"
  on public.comentarios for insert
  to authenticated
  with check (auth.uid() = autor_id);

-- Solo el autor puede editar su comentario
drop policy if exists "comentarios_update_propio" on public.comentarios;
create policy "comentarios_update_propio"
  on public.comentarios for update
  to authenticated
  using (auth.uid() = autor_id)
  with check (auth.uid() = autor_id);

-- Solo el autor puede borrar su comentario
drop policy if exists "comentarios_delete_propio" on public.comentarios;
create policy "comentarios_delete_propio"
  on public.comentarios for delete
  to authenticated
  using (auth.uid() = autor_id);

-- (Opcional) Habilitar Realtime para que los comentarios de otros
-- usuarios aparezcan sin recargar la página. No falla si ya está
-- agregada.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'comentarios'
  ) then
    alter publication supabase_realtime add table public.comentarios;
  end if;
end $$;


do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'mascotas'
      and column_name = 'comentarios'
  ) then
    insert into public.comentarios (mascota_id, autor_id, autor_nombre, texto, fecha)
    select
      m.id,
      (c->>'autor_id')::uuid,
      c->>'autor_nombre',
      c->>'texto',
      (c->>'fecha')::timestamptz
    from public.mascotas m,
         jsonb_array_elements(to_jsonb(m.comentarios)) as c
    where m.comentarios is not null;
  end if;
end $$;

