/* ============================================================
   ALERTA PATITAS — supabaseClient.js
   Cliente oficial de Supabase (@supabase/supabase-js).

   Esto reemplaza al antiguo `supabase.js` que hacía fetch()
   manual contra la REST API. Ventajas de este cambio:
     - Maneja sesión, tokens y refresh automáticamente.
     - Expone supabase.auth para Auth real (ver AuthContext).
     - Expone supabase.storage para subir archivos sin tocar
       fetch a mano.
     - Los métodos .select()/.insert()/.update()/.eq()/.order()
       funcionan igual que antes, pero validados por el SDK.

   Las credenciales YA NO están escritas directamente en el
   código: se leen desde variables de entorno (ver .env.example).
   ============================================================ */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Copia .env.example a .env y completa tus credenciales de Supabase.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
