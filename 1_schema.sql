-- ============================================================
--  ALERTA PATITAS — Schema PostgreSQL para Supabase
--  Ejecuta este archivo en: Supabase → SQL Editor → New query
-- ============================================================

-- ────────────────────────────────────────────
-- 1. EXTENSIÓN para UUIDs (ya viene en Supabase,
--    pero la declaramos por si acaso)
-- ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ────────────────────────────────────────────
-- 2. TABLA: usuarios
--    Reemplaza la hoja "Usuarios" del Sheet.
--    password_hash y salt: SHA-256 desde el cliente
--    (igual que en tu Apps Script actual).
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nick             TEXT        NOT NULL UNIQUE,
  email            TEXT        NOT NULL UNIQUE,
  password_hash    TEXT        NOT NULL,
  salt             TEXT        NOT NULL,
  fecha_registro   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para login rápido por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (LOWER(email));


-- ────────────────────────────────────────────
-- 3. TABLA: mascotas
--    Reemplaza la hoja "Hoja 1" del Sheet.
--    Las fotos se almacenan en Supabase Storage
--    y aquí guardamos un array con sus URLs públicas.
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mascotas (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT        NOT NULL,
  mascota         TEXT        NOT NULL,          -- perro | gato | ave | otros
  sexo            TEXT,                          -- macho | hembra
  edad            TEXT,                          -- cachorro | corta | adulto | senior
  tamano          TEXT,                          -- pequeño | mediano | grande
  estado          TEXT        NOT NULL DEFAULT 'perdido',  -- perdido | buscando
  descripcion     TEXT,
  contacto        TEXT,
  fotos           TEXT[]      DEFAULT '{}',      -- array de URLs públicas de Storage
  autor_id        UUID        REFERENCES usuarios(id) ON DELETE SET NULL,
  autor_correo    TEXT,                          -- desnormalizado para búsqueda rápida
  fecha           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices frecuentes
CREATE INDEX IF NOT EXISTS idx_mascotas_estado   ON mascotas (estado);
CREATE INDEX IF NOT EXISTS idx_mascotas_mascota  ON mascotas (mascota);
CREATE INDEX IF NOT EXISTS idx_mascotas_fecha    ON mascotas (fecha DESC);
CREATE INDEX IF NOT EXISTS idx_mascotas_autor    ON mascotas (autor_id);


-- ────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY (RLS)
--    Supabase activa RLS por defecto.
--    Estas políticas permiten:
--      - Cualquiera lee mascotas y usuarios (lectura pública)
--      - Solo el propio usuario puede modificar SUS mascotas
--      - Insertar mascotas y usuarios sin autenticación de Supabase
--        (usamos nuestra propia auth con password_hash)
-- ────────────────────────────────────────────

-- Usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios_select" ON usuarios
  FOR SELECT USING (true);

CREATE POLICY "usuarios_insert" ON usuarios
  FOR INSERT WITH CHECK (true);

-- Mascotas
ALTER TABLE mascotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mascotas_select" ON mascotas
  FOR SELECT USING (true);

CREATE POLICY "mascotas_insert" ON mascotas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "mascotas_update" ON mascotas
  FOR UPDATE USING (
    autor_correo = current_setting('app.usuario_correo', true)
  );

CREATE POLICY "mascotas_delete" ON mascotas
  FOR DELETE USING (
    autor_correo = current_setting('app.usuario_correo', true)
  );


-- ────────────────────────────────────────────
-- 5. STORAGE BUCKET para fotos
--    Ejecuta esto TAMBIÉN en el SQL Editor.
--    Crea un bucket público llamado "fotos-mascotas".
-- ────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos-mascotas', 'fotos-mascotas', true)
ON CONFLICT (id) DO NOTHING;

-- Política: cualquiera puede ver las fotos
CREATE POLICY "fotos_select_public"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'fotos-mascotas' );

-- Política: cualquiera puede subir fotos (para tu caso de uso)
CREATE POLICY "fotos_insert_public"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'fotos-mascotas' );


-- ────────────────────────────────────────────
-- 6. VERIFICACIÓN RÁPIDA
--    Al terminar deberías ver ambas tablas vacías.
-- ────────────────────────────────────────────
SELECT 'usuarios' AS tabla, COUNT(*) FROM usuarios
UNION ALL
SELECT 'mascotas', COUNT(*) FROM mascotas;

ALTER TABLE mascotas ADD COLUMN IF NOT EXISTS zona TEXT;
ALTER TABLE mascotas ADD COLUMN IF NOT EXISTS comentarios JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_mascotas_zona ON mascotas (zona);

DROP POLICY IF EXISTS "mascotas_update" ON mascotas;

CREATE POLICY "mascotas_update" ON mascotas
  FOR UPDATE USING (true);