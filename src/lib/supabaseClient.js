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

function crearErrorConfiguracion() {
  return new Error(
    'Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Copia .env.example a .env y completa tus credenciales de Supabase.'
  );
}

function crearRespuestaError() {
  return { data: null, error: crearErrorConfiguracion() };
}

function crearConsultaDeshabilitada() {
  const respuesta = crearRespuestaError();

  const consulta = {
    eq() {
      return consulta;
    },
    order() {
      return Promise.resolve(respuesta);
    },
    single() {
      return Promise.resolve(respuesta);
    },
    maybeSingle() {
      return Promise.resolve(respuesta);
    },
    then(resolve, reject) {
      return Promise.resolve(respuesta).then(resolve, reject);
    },
  };

  return consulta;
}

function crearClienteSinSupabase() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signUp: async () => crearRespuestaError(),
      signInWithPassword: async () => crearRespuestaError(),
      signOut: async () => ({ error: crearErrorConfiguracion() }),
    },
    from() {
      return {
        select() {
          return crearConsultaDeshabilitada();
        },
        insert: async () => crearRespuestaError(),
        update() {
          return crearConsultaDeshabilitada();
        },
        delete() {
          return crearConsultaDeshabilitada();
        },
        upsert: async () => crearRespuestaError(),
      };
    },
    storage: {
      from() {
        return {
          upload: async () => crearRespuestaError(),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        };
      },
    },
  };
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : crearClienteSinSupabase();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase no está configurado: la app renderizará la interfaz, pero no podrá cargar ni guardar datos hasta que completes VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'
  );
}
