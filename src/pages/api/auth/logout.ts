
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export const POST: APIRoute = async ({
  request,
  cookies,
  redirect,
}) => {
  try {
    const supabase = createSupabaseServerClient(cookies, request);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);

      return new Response("Logout failed", {
        status: 500,
      });
    }

    return redirect("/dashboard/login", 303);
  } catch (error) {
    console.error("Logout API error:", error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};
