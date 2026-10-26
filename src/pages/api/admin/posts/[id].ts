import type { APIRoute } from "astro";
import { requireSuperAdmin, adminJsonError } from "../../../../lib/admin-auth";

export const prerender = false;

function validUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export const PATCH: APIRoute = async (context) => {
  const auth = await requireSuperAdmin(context);
  if (!auth.ok) return adminJsonError(auth.status, auth.message);

  const id = context.params.id ?? "";
  if (!validUuid(id)) return adminJsonError(400, "Invalid post ID.");

  let body: any;
  try {
    body = await context.request.json();
  } catch {
    return adminJsonError(400, "Invalid JSON.");
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if ("title" in body) {
    if (typeof body.title !== "string" || !body.title.trim() || body.title.trim().length > 200) {
      return adminJsonError(400, "Invalid title.");
    }
    update.title = body.title.trim();
  }
  if ("slug" in body) {
    if (typeof body.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug) || body.slug.length > 120) {
      return adminJsonError(400, "Invalid slug.");
    }
    update.slug = body.slug;
  }
  if ("description" in body) {
    if (typeof body.description !== "string") return adminJsonError(400, "Invalid description.");
    update.description = body.description.trim();
  }
  if ("content" in body) {
    if (typeof body.content !== "string" || body.content.length > 500_000) return adminJsonError(400, "Invalid content.");
    update.content = body.content;
  }
  if ("hero_image" in body) {
    update.hero_image = typeof body.hero_image === "string" && body.hero_image.trim() ? body.hero_image.trim() : null;
  }
  if ("tags" in body) {
    if (!Array.isArray(body.tags)) return adminJsonError(400, "Tags must be an array.");
    update.tags = body.tags.filter((tag: unknown): tag is string => typeof tag === "string")
      .map((tag: string) => tag.trim()).filter(Boolean).slice(0, 30);
  }
  if ("published" in body) {
    if (typeof body.published !== "boolean") return adminJsonError(400, "Published must be boolean.");
    update.published = body.published;
    if (body.published) update.pub_date = new Date().toISOString();
  }

  const { data, error } = await auth.supabase
    .from("posts")
    .update(update)
    .eq("id", id)
    .select("id, slug, title, published")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") return adminJsonError(409, "That slug is already in use.");
    return adminJsonError(500, "Could not update post.");
  }
  if (!data) return adminJsonError(404, "Post not found.");

  return new Response(JSON.stringify({ post: data }), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
};

export const DELETE: APIRoute = async (context) => {
  const auth = await requireSuperAdmin(context);
  if (!auth.ok) return adminJsonError(auth.status, auth.message);

  const id = context.params.id ?? "";
  if (!validUuid(id)) return adminJsonError(400, "Invalid post ID.");

  const { data, error } = await auth.supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return adminJsonError(500, "Could not delete post.");
  if (!data) return adminJsonError(404, "Post not found.");

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
};
