import { Link } from "@tanstack/react-router";
import { Play, X } from "lucide-react";
import { useLibrary } from "@/lib/store";

export function ContinueWatching() {
  const history = useLibrary((s) => s.history);
  const remove = useLibrary((s) => s.removeHistory);

  if (history.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-semibold tracking-tight">Continue Watching</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {history.slice(0, 10).map((h) => (
          <div key={h.id} className="group relative">
            <Link
              to="/watch/$id/$ep"
              params={{ id: String(h.id), ep: String(h.episode) }}
              className="block"
            >
              <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                {h.poster && (
                  <img
                    src={h.poster}
                    alt={h.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="h-8 w-8 fill-primary text-primary" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-2">
                  <p className="text-xs font-medium text-primary">
                    Episode {h.episode}
                  </p>
                </div>
              </div>
              <h3 className="mt-2 line-clamp-1 text-sm font-medium">{h.title}</h3>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                remove(h.id);
              }}
              className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}