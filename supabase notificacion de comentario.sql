-- ============================================================
-- ALERTA PATITAS — Notificaciones de comentarios
-- Ejecuta esto DESPUÉS de tener creadas las tablas mascotas
-- y comentarios. Es seguro de volver a ejecutar.
-- ============================================================

create table if not exists public.notificaciones (
  id             uuid primary key default gen_random_uuid(),
  usuario_id     uuid not null references auth.users(id) on delete cascade,
  mascota_id     uuid not null references public.mascotas(id) on delete cascade,
  mascota_nombre text not null,
  comentario_id  uuid references public.comentarios(id) on delete cascade,
  autor_nombre   text not null,
  leido          boolean not null default false,
  fecha          timestamptz not null default now()
);

create index if not exists notificaciones_usuario_id_idx
  on public.notificaciones (usuario_id, leido);

alter table public.notificaciones enable row level security;

-- Cada usuario solo ve sus propias notificaciones
drop policy if exists "notificaciones_select_propio" on public.notificaciones;
create policy "notificaciones_select_propio"
  on public.notificaciones for select
  to authenticated
  using (auth.uid() = usuario_id);

-- Cada usuario solo puede marcar como leídas las suyas
drop policy if exists "notificaciones_update_propio" on public.notificaciones;
create policy "notificaciones_update_propio"
  on public.notificaciones for update
  to authenticated
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

-- Nota: a propósito NO hay policy de "insert" para usuarios.
-- Las notificaciones las crea el trigger de abajo (con permisos
-- elevados), nunca el cliente directamente.

-- ── Trigger: crea la notificación al insertar un comentario ──
create or replace function public.notificar_nuevo_comentario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dueno_id uuid;
  v_mascota_nombre text;
begin
  select autor_id, nombre
    into v_dueno_id, v_mascota_nombre
    from public.mascotas
   where id = new.mascota_id;

  -- No notificar si el dueño comenta en su propia publicación,
  -- o si la publicación no tiene dueño registrado (autor_id null).
  if v_dueno_id is not null and v_dueno_id <> new.autor_id then
    insert into public.notificaciones
      (usuario_id, mascota_id, mascota_nombre, comentario_id, autor_nombre)
    values
      (v_dueno_id, new.mascota_id, v_mascota_nombre, new.id, new.autor_nombre);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_notificar_nuevo_comentario on public.comentarios;
create trigger trg_notificar_nuevo_comentario
  after insert on public.comentarios
  for each row
  execute function public.notificar_nuevo_comentario();

-- (Opcional) Realtime para que la notificación llegue al instante,
-- sin que el usuario tenga que recargar la página.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notificaciones'
  ) then
    alter publication supabase_realtime add table public.notificaciones;
  end if;
end $$;
