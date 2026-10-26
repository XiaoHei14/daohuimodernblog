
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export const GET: APIRoute = async ({
  request,
  cookies,
  redirect,
}) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code || url.searchParams.has("error")) {
    return redirect("/dashboard/login?error=oauth", 303);
  }

  const supabase = createSupabaseServerClient(cookies, request);

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth callback error:", error);
    return redirect("/dashboard/login?error=oauth", 303);
  }

  return redirect("/dashboard", 303);
};
