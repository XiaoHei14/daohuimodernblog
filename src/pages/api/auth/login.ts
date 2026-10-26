import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");

  if (!email || !password) {
    return redirect("/dashboard/login?error=missing_credentials", 303);
  }

  const supabase = createSupabaseServerClient(cookies, request);
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect("/dashboard/login?error=invalid_credentials", 303);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user?.app_metadata?.is_super_admin !== true) {
    await supabase.auth.signOut();
    return new Response("403 Forbidden — this account is not a super-admin.", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  return redirect("/dashboard", 303);
};
