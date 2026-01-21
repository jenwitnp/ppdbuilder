import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy-loaded clients to avoid initialization during build
let supabaseClient: SupabaseClient | null = null;
let supabaseServiceClient: SupabaseClient | null = null;

function initSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

function initSupabaseServiceClient() {
  if (supabaseServiceClient) return supabaseServiceClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  supabaseServiceClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return supabaseServiceClient;
}

// Export getters instead of direct instances
export const getSupabase = () => initSupabaseClient();
export const getSupabaseWithServiceRole = () => initSupabaseServiceClient();

// Legacy exports for backward compatibility
export const supabase = new Proxy<SupabaseClient>(
  {} as SupabaseClient,
  {
    get: (target: SupabaseClient, prop: string | symbol): unknown =>
      getSupabase()[prop as keyof SupabaseClient],
  } as ProxyHandler<SupabaseClient>,
);

export const supabaseWithServiceRole = new Proxy<SupabaseClient>(
  {} as SupabaseClient,
  {
    get: (target: SupabaseClient, prop: string | symbol): unknown =>
      getSupabaseWithServiceRole()[prop as keyof SupabaseClient],
  } as ProxyHandler<SupabaseClient>,
);

// Legacy function for backward compatibility
export const getServiceSupabase = () => getSupabaseWithServiceRole();
