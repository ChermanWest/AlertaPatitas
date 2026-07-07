/* ============================================================
   ALERTA PATITAS — AuthContext.jsx

   Reemplaza a auth.js (registrarUsuario/loginUsuario con
   SHA-256 hecho a mano contra una tabla "usuarios").

   Por qué el cambio:
     - En el código original, la contraseña se hasheaba en el
       navegador y el hash+salt se guardaban en una tabla propia
       consultable con la misma anon key que usa todo el resto
       del sitio. Cualquiera con la anon key podía potencialmente
       leer esos hashes vía REST.
     - Supabase Auth guarda y verifica las contraseñas del lado
       del servidor, nunca expone hashes, y entrega una sesión
       (JWT) que además nos sirve para las políticas de RLS
       (auth.uid()) en las tablas "mascotas" y en Storage.

   El "nick" del usuario se guarda en user_metadata al registrarse
   y se lee desde session.user.user_metadata.nick.
   ============================================================ */

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

function traducirError(error) {
  const msg = error?.message || '';
  if (msg.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (msg.includes('already registered') || msg.includes('already been registered')) {
    return 'Ya existe una cuenta con ese correo electrónico.';
  }
  if (msg.toLowerCase().includes('password should be')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (msg.toLowerCase().includes('email not confirmed')) {
    return 'Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.';
  }
  return msg || 'Ocurrió un error. Intenta nuevamente.';
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const usuario = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        nick: session.user.user_metadata?.nick || session.user.email?.split('@')[0] || 'Usuario',
      }
    : null;

  /* ── Registro ── */
  async function registrar({ nick, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nick } },
    });
    if (error) throw new Error(traducirError(error));
    return data.user;
  }

  /* ── Login ── */
  async function iniciarSesion({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(traducirError(error));
    return data.user;
  }

  /* ── Logout ── */
  async function cerrarSesion() {
    await supabase.auth.signOut();
  }

  const value = { usuario, session, loading, registrar, iniciarSesion, cerrarSesion };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
