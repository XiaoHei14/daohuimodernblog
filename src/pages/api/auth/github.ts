import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, request, redirect }) => {
  const supabase = createSupabaseServerClient(cookies, request);
  const callbackUrl = new URL("/auth/callback", request.url).toString();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: callbackUrl },
  });

  if (error || !data.url) {
    return new Response("Unable to start GitHub OAuth.", { status: 500 });
  }

  return redirect(data.url, 302);
};
