
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export const GET: APIRoute = async ({
  request,
  cookies,
  redirect,
}) => {
  const supabase = createSupabaseServerClient(cookies, request);

  const callbackUrl = new URL(
    "/auth/callback",
    request.url,
  ).toString();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error || !data.url) {
    console.error("Supabase OAuth error:", error);
    return redirect("/dashboard/login?error=oauth", 303);
  }

  return redirect(data.url, 302);
};
