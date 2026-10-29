import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return NextResponse.json({
    status: isSupabaseConfigured ? "healthy" : "warning",
    timestamp: new Date().toISOString(),
    supabase: {
      configured: isSupabaseConfigured,
      url: supabaseUrl || null,
      hasAnonKey,
      clientInitialized: Boolean(supabase),
    },
    message: isSupabaseConfigured
      ? "Supabase Realtime is configured and ready for live multiplayer sync."
      : "Supabase environment variables are missing. App is running in local BroadcastChannel fallback mode.",
  });
}
