import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isCloudConfigured = Boolean(url && anonKey);

/**
 * `null` whenever VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não estão
 * definidos — todos os chamadores devem tratar isso como "sincronização
 * cloud indisponível, fica só local", nunca lançar erro. Isto mantém a Nova
 * Sabrina totalmente utilizável sem qualquer backend.
 */
export const supabase: SupabaseClient | null = isCloudConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true, // mantém a sessão entre refresh/fecho sem novo login
        autoRefreshToken: true, // renova o token de acesso em segundo plano enquanto a app está aberta
        detectSessionInUrl: true // necessário para captar a sessão após o redirect do magic link
      }
    })
  : null;
