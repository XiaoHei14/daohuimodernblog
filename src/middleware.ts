
import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerClient } from "./lib/supabase-server";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isDashboard = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/dashboard/login";

  if (!isDashboard || isLoginPage) {
    return next();
  }

  const supabase = createSupabaseServerClient(
    context.cookies,
    context.request,
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return context.redirect("/dashboard/login");
  }

  if (user?.is_super_admin !== true) {
    return new Response("403 Forbidden", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  context.locals.user = user;

  return next();
});
