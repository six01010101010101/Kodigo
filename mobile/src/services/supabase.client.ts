import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://oxaydmsemyjrmyhnxwpt.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_UOrNI4xuckpku0zEPVroVw_YCld8Juc';
export const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/pytho-chat`;

export const supabaseMobile = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
