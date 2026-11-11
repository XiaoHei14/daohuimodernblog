import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../lib/supabase-server";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, request, url, redirect }) => {
  const code = url.searchParams.get("code");
  const errorDescription = url.searchParams.get("error_description");

  if (errorDescription) {
    return redirect(`/dashboard/login?error=${encodeURIComponent(errorDescription)}`);
  }
  if (!code) {
    return redirect("/dashboard/login?error=missing_oauth_code");
  }

  const supabase = createSupabaseServerClient(cookies, request);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirect(`/dashboard/login?error=${encodeURIComponent("oauth_callback_failed")}`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/dashboard/login?error=login_failed");

  if (user.app_metadata?.is_super_admin !== true) {
    await supabase.auth.signOut();
    return new Response("403 Forbidden — this account is not a super-admin.", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  return redirect("/dashboard", 303);
};
