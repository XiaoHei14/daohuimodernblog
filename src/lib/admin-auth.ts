import type { APIContext, MiddlewareHandler } from "astro";
import { createSupabaseServerClient } from "./supabase-server";

export async function requireSuperAdmin(context: APIContext) {
  const supabase = createSupabaseServerClient(context.cookies, context.request);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      ok: false as const,
      status: 401,
      message: "Authentication required.",
      supabase,
      user: null,
    };
  }

  if (data.user.app_metadata?.is_super_admin !== true) {
    return {
      ok: false as const,
      status: 403,
      message: "Super-admin access required.",
      supabase,
      user: data.user,
    };
  }

  return {
    ok: true as const,
    supabase,
    user: data.user,
  };
}

export function adminJsonError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
