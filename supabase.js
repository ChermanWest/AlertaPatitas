/* ============================================================
   ALERTA PATITAS — supabase.js
   Cliente compartido de Supabase.
   Incluye este archivo ANTES que auth.js, loader.js,
   editor.js y filters.js en cada página HTML.

   CONFIGURACIÓN:
   1. Ve a tu proyecto en supabase.com
   2. Settings → API
   3. Copia "Project URL" y "anon public key"
   4. Pégalos abajo
   ============================================================ */

const SUPABASE_URL     = 'https://ffrvurrmhtpajpplbdam.supabase.co/rest/v1/';   // ← reemplaza
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmcnZ1cnJtaHRwYWpwcGxiZGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMDgxMjEsImV4cCI6MjA5ODc4NDEyMX0.BlThrLK4VT_l4rT5HlNcLW7WNwqN6dT9162ADXTkhbk; // ← reemplaza

/* ── Utilidades HTTP para la API REST de Supabase ── */
const sb = {

  /* Cabeceras base */
  _headers(extra = {}) {
    return {
      'apikey':        SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        'return=representation',
      ...extra,
    };
  },

  /* GET — SELECT
     sb.from('mascotas').select()
     sb.from('mascotas').select('id,nombre').eq('estado','perdido').order('fecha','desc')
  */
  from(table) {
    const base = `${SUPABASE_URL}/rest/v1/${table}`;
    let query   = '';
    let _select = '*';

    const chain = {
      select(cols = '*') { _select = cols; return chain; },
      eq(col, val)       { query += `&${col}=eq.${encodeURIComponent(val)}`; return chain; },
      neq(col, val)      { query += `&${col}=neq.${encodeURIComponent(val)}`; return chain; },
      order(col, dir = 'asc') { query += `&order=${col}.${dir}`; return chain; },
      limit(n)           { query += `&limit=${n}`; return chain; },

      async get() {
        const url = `${base}?select=${encodeURIComponent(_select)}${query}`;
        const res = await fetch(url, { headers: sb._headers({ 'Prefer': '' }) });
        if (!res.ok) throw new Error(`Supabase GET error ${res.status}: ${await res.text()}`);
        return res.json();
      },

      async insert(data) {
        const res = await fetch(base, {
          method:  'POST',
          headers: sb._headers(),
          body:    JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Supabase INSERT error ${res.status}: ${await res.text()}`);
        return res.json();
      },

      async update(data, col, val) {
        const url = `${base}?${col}=eq.${encodeURIComponent(val)}`;
        const res = await fetch(url, {
          method:  'PATCH',
          headers: sb._headers(),
          body:    JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Supabase UPDATE error ${res.status}: ${await res.text()}`);
        return res.json();
      },

      async delete(col, val) {
        const url = `${base}?${col}=eq.${encodeURIComponent(val)}`;
        const res = await fetch(url, {
          method:  'DELETE',
          headers: sb._headers({ 'Prefer': '' }),
        });
        if (!res.ok) throw new Error(`Supabase DELETE error ${res.status}: ${await res.text()}`);
        return true;
      },
    };

    return chain;
  },

  /* ── STORAGE: subir un archivo ──
     Devuelve la URL pública del archivo.
     bucket   → nombre del bucket (ej: 'fotos-mascotas')
     path     → ruta dentro del bucket (ej: 'mascota_abc_0.jpg')
     file     → objeto File del input[type=file]
  */
  async uploadFile(bucket, path, file) {
    const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;
    const res = await fetch(url, {
      method:  'POST',
      headers: {
        'apikey':        SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type':  file.type || 'application/octet-stream',
        'x-upsert':      'true',
      },
      body: file,
    });
    if (!res.ok) throw new Error(`Storage upload error ${res.status}: ${await res.text()}`);
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  },

  /* ── Hash SHA-256 con la Web Crypto API (browser nativo) ──
     Replica la lógica de hashearPassword() del Apps Script.
     Uso: await sb.hashPassword(password, salt)
  */
  async hashPassword(password, salt) {
    const input  = salt + password + salt;
    const data   = new TextEncoder().encode(input);
    const buffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  /* ── Genera un salt aleatorio (igual que en el .gs) ── */
  generateSalt() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  },
};
