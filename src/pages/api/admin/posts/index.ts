import type { APIRoute } from "astro";
import { requireSuperAdmin, adminJsonError } from "../../../../lib/admin-auth";

export const prerender = false;

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 120;
}

export const GET: APIRoute = async (context) => {
  const auth = await requireSuperAdmin(context);
  if (!auth.ok) return adminJsonError(auth.status, auth.message);

  const { data, error } = await auth.supabase
    .from("posts")
    .select("id, slug, title, description, pub_date, published, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) return adminJsonError(500, "Could not load posts.");
  return new Response(JSON.stringify({ posts: data ?? [] }), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
};

export const POST: APIRoute = async (context) => {
  const auth = await requireSuperAdmin(context);
  if (!auth.ok) return adminJsonError(auth.status, auth.message);

  let body: any;
  try {
    body = await context.request.json();
  } catch {
    return adminJsonError(400, "Invalid JSON.");
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  const heroImage = typeof body.hero_image === "string" && body.hero_image.trim() ? body.hero_image.trim() : null;
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((tag: unknown): tag is string => typeof tag === "string").map((tag: string) => tag.trim()).filter(Boolean).slice(0, 30)
    : [];
  const published = body.published === true;

  if (!title || title.length > 200) return adminJsonError(400, "Title is required (maximum 200 characters).");
  if (!isValidSlug(slug)) return adminJsonError(400, "Slug must use lowercase letters, numbers, and hyphens.");
  if (content.length > 500_000) return adminJsonError(413, "Content is too large.");

  const { data, error } = await auth.supabase
    .from("posts")
    .insert({
      title, slug, description, content, hero_image: heroImage, tags,
      published, pub_date: published ? new Date().toISOString() : null,
    })
    .select("id, slug, title, published")
    .single();

  if (error) {
    if (error.code === "23505") return adminJsonError(409, "That slug is already in use.");
    return adminJsonError(500, "Could not create post.");
  }

  return new Response(JSON.stringify({ post: data }), {
    status: 201,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
};
