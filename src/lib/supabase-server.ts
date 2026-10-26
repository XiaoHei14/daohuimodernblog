
import { createServerClient } from "@supabase/ssr";
import type { AstroCookies } from "astro";

export function createSupabaseServerClient(
  cookies: AstroCookies,
  request: Request,
) {
  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabaseKey = import.meta.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_KEY");
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        const cookieHeader = request.headers.get("cookie") ?? "";

        return cookieHeader
          .split(";")
          .map((part) => {
            const index = part.indexOf("=");

            if (index < 0) return null;

            return {
              name: part.slice(0, index).trim(),
              value: part.slice(index + 1).trim(),
            };
          })
          .filter(
            (cookie): cookie is { name: string; value: string } =>
              cookie !== null && cookie.name.length > 0,
          );
      },

      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, {
            ...options,
            path: options.path ?? "/",
          });
        }
      },
    },
  });
}
