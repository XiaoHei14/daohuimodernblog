
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "../../../lib/supabase-server";

export const POST: APIRoute = async ({
  request,
  cookies,
  redirect,
}) => {
  try {
    const form = await request.formData();

    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      return new Response("Email and password are required", {
        status: 400,
      });
    }

    const supabase = createSupabaseServerClient(cookies, request);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/dashboard/login?error=credentials", 303);
    }

    return redirect("/dashboard", 303);
  } catch (error) {
    console.error("Login API error:", error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};
