import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useLibrary } from "@/lib/store";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — Chidori Anime" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const history = useLibrary((s) => s.history);
  const remove = useLibrary((s) => s.removeHistory);
  const clear = useLibrary((s) => s.clearHistory);

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Watch History</h1>
        {history.length > 0 && (
          <button
            onClick={clear}
            className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm hover:bg-secondary/70"
          >
            Clear all
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Nothing watched yet.
        </p>
      ) : (
        <div className="space-y-2">
          {history.map((h) => (
            <div
              key={h.id}
              className="group flex items-center gap-3 rounded-md border border-border bg-card p-2"
            >
              <Link
                to="/watch/$id/$ep"
                params={{ id: String(h.id), ep: String(h.episode) }}
                className="flex flex-1 items-center gap-3"
              >
                {h.poster && (
                  <img
                    src={h.poster}
                    alt={h.title}
                    className="h-16 w-12 flex-shrink-0 rounded object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{h.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Episode {h.episode} ·{" "}
                    {new Date(h.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => remove(h.id)}
                className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}