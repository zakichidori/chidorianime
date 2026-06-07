import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLibrary } from "@/lib/store";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks — Chidori Anime" }] }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const bookmarks = useLibrary((s) => s.bookmarks);
  const toggle = useLibrary((s) => s.toggleBookmark);

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No bookmarks yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {bookmarks.map((b) => (
            <div key={b.id} className="group relative">
              <Link to="/anime/$id" params={{ id: String(b.id) }} className="block">
                <div className="aspect-[2/3] overflow-hidden rounded-md bg-muted">
                  {b.poster && (
                    <img
                      src={b.poster}
                      alt={b.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-medium">{b.title}</h3>
              </Link>
              <button
                onClick={() => toggle(b)}
                className="absolute right-2 top-2 rounded-full bg-background/85 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}