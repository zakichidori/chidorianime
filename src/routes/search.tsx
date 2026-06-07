import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { AnimeCard, AnimeCardSkeleton } from "@/components/AnimeCard";
import { normalizeCard } from "@/lib/anime";
import { sortAnime } from "@/lib/search";
import { Search as SearchIcon } from "lucide-react";

const GENRES = [
  "action", "adventure", "comedy", "drama", "fantasy",
  "romance", "harem", "shoujo", "shounen", "mystery",
  "horror", "sci-fi", "slice-of-life", "supernatural",
];

const searchSchema = z.object({
  q: z.string().optional(),
  genre: z.string().optional(),
  ratefrom: z.coerce.number().optional(),
  rateto: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "Search — Chidori Anime" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [q, setQ] = useState(search.q ?? "");

  useEffect(() => {
    setQ(search.q ?? "");
  }, [search.q]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== (search.q ?? "")) {
        navigate({
          to: "/search",
          search: { ...search, q: q || undefined, page: 1 },
        });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isLoading } = useQuery({
    queryKey: ["sort", search],
    queryFn: () =>
      sortAnime({
        name: search.q,
        genre: search.genre,
        ratefrom: search.ratefrom,
        rateto: search.rateto,
        page: search.page ?? 1,
      }),
    staleTime: 2 * 60_000,
  });

  const update = (patch: any) =>
    navigate({ to: "/search", search: { ...search, ...patch, page: 1 } });

  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="space-y-6">
          <div className="relative md:hidden">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search anime"
              className="w-full rounded-md border border-border bg-secondary py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Genre</h3>
            <div className="flex flex-wrap gap-1.5 md:flex-col md:gap-1">
              <button
                onClick={() => update({ genre: undefined })}
                className={`rounded px-2.5 py-1 text-left text-sm ${
                  !search.genre
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/70"
                }`}
              >
                All
              </button>
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => update({ genre: g })}
                  className={`rounded px-2.5 py-1 text-left text-sm capitalize ${
                    search.genre === g
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/70"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">MAL Score</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                placeholder="Min"
                value={search.ratefrom ?? ""}
                onChange={(e) =>
                  update({
                    ratefrom: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full rounded border border-border bg-secondary px-2 py-1 text-sm focus:border-primary focus:outline-none"
              />
              <span className="text-muted-foreground">—</span>
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                placeholder="Max"
                value={search.rateto ?? ""}
                onChange={(e) =>
                  update({
                    rateto: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full rounded border border-border bg-secondary px-2 py-1 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 hidden md:block">
            <h1 className="text-2xl font-bold tracking-tight">
              {search.q ? `Results for "${search.q}"` : "Browse"}
            </h1>
            {data && (
              <p className="text-sm text-muted-foreground">
                Page {search.page ?? 1} of {data.totalPages}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 15 }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
              ))}
            </div>
          ) : !data?.results?.length ? (
            <p className="py-12 text-center text-muted-foreground">No results</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {data.results.map((c) => (
                  <AnimeCard key={c._id ?? c.Id} a={normalizeCard(c)} />
                ))}
              </div>
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: Math.min(data.totalPages, 10) }).map(
                  (_, i) => {
                    const p = i + 1;
                    const current = search.page ?? 1;
                    return (
                      <button
                        key={p}
                        onClick={() =>
                          navigate({
                            to: "/search",
                            search: { ...search, page: p },
                          })
                        }
                        className={`h-8 w-8 rounded text-sm ${
                          current === p
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/70"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  }
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}