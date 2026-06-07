import { createFileRoute } from "@tanstack/react-router";

const ORIGIN = "https://anipub.xyz";

export const Route = createFileRoute("/api/proxy/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const url = new URL(request.url);
        const target = `${ORIGIN}/${params._splat}${url.search}`;
        try {
          const res = await fetch(target, {
            headers: { Accept: "application/json" },
          });
          const body = await res.text();
          return new Response(body, {
            status: res.status,
            headers: {
              "Content-Type":
                res.headers.get("content-type") ?? "application/json",
              "Cache-Control": "public, max-age=300",
            },
          });
        } catch (e) {
          return new Response(
            JSON.stringify({ error: "upstream_failed" }),
            { status: 502, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      POST: async ({ params, request }) => {
        const body = await request.text();
        const res = await fetch(`${ORIGIN}/${params._splat}`, {
          method: "POST",
          headers: {
            "Content-Type":
              request.headers.get("content-type") ?? "application/json",
          },
          body,
        });
        const text = await res.text();
        return new Response(text, {
          status: res.status,
          headers: {
            "Content-Type":
              res.headers.get("content-type") ?? "application/json",
          },
        });
      },
    },
  },
});