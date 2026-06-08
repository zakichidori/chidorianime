import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, BookmarkCheck, Play, Star } from "lucide-react";
import { Layout } from "@/components/Layout";
import { getAnimeInfo, getFullDetails } from "@/lib/anime";
import { useLibrary } from "@/lib/store";
import { fixImg } from "@/lib/api";

export const Route = createFileRoute("/anime/$id")({
  component: AnimeDetailsPage,
  errorComponent: ({ error }) => (
    <Layout>
      <div className="py-20 text-center text-muted-foreground">
        {error.message}
      </div>
    </Layout>
  ),
});

function AnimeDetailsPage() {
  const { id } = Route.useParams();
  const { data: info, isLoading } = useQuery({
    queryKey: ["info", id],
    queryFn: () => getAnimeInfo(id),
    staleTime: 10 * 60_000,
  });
  const { data: full } = useQuery({
    queryKey: ["full", id],
    queryFn: () => getFullDetails(id),
    staleTime: 10 * 60_000,
    enabled: !!info?._id,
  });
  const toggle = useLibrary((s) => s.toggleBookmark);
  const isBookmarked = useLibrary((s) =>
    info ? s.isBookmarked(info._id) : false
  );

  if (isLoading || !info) {
    return (
      <Layout>
        <div className="py-20 text-center text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative -mx-4 mb-8 md:-mx-8">
        <div className="relative aspect-[21/9] max-h-[420px] w-full overflow-hidden">
          {info.Cover && (
            <img
              src={info.Cover}
              alt=""
              referrerPolicy="no-referrer"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[220px_1fr] md:gap-8">
        <div>
          <div className="-mt-32 overflow-hidden rounded-md bg-muted shadow-lg md:-mt-48">
            {info.ImagePath && (
              <img
                src={info.ImagePath}
                alt={info.Name}
                className="aspect-[2/3] w-full object-cover"
              />
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/watch/$id/$ep"
              params={{ id: String(info._id), ep: "1" }}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Play className="h-4 w-4 fill-current" /> Watch Now
            </Link>
            <button
              onClick={() =>
                toggle({
                  id: info._id,
                  title: info.Name,
                  poster: info.ImagePath,
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-secondary px-4 py-2.5 text-sm font-medium hover:bg-secondary/70"
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="h-4 w-4 text-primary" /> Bookmarked
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" /> Bookmark
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {info.Name}
          </h1>
          {info.Synonyms && info.Synonyms !== info.Name && (
            <p className="mt-1 text-sm text-muted-foreground">{info.Synonyms}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {info.MALScore && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-semibold text-foreground">
                  {info.MALScore}
                </span>
                {info.RatingsNum ? `(${info.RatingsNum})` : ""}
              </span>
            )}
            {info.Status && <span>{info.Status}</span>}
            {info.epCount && <span>{info.epCount} episodes</span>}
            {info.Duration && <span>{info.Duration}m</span>}
            {info.Aired && <span>{info.Aired}</span>}
          </div>

          {info.Genres && info.Genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {info.Genres.map((g) => (
                <Link
                  key={g}
                  to="/search"
                  search={{ genre: g } as any}
                  className="rounded-full bg-secondary px-3 py-1 text-xs capitalize hover:bg-secondary/70"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}

          <h2 className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Synopsis
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {full?.jikan?.synopsis ?? info.DescripTion}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-3">
            {info.Studios && (
              <div>
                <dt className="text-muted-foreground">Studios</dt>
                <dd>{info.Studios}</dd>
              </div>
            )}
            {info.Producers && (
              <div className="col-span-2">
                <dt className="text-muted-foreground">Producers</dt>
                <dd className="line-clamp-2">{info.Producers}</dd>
              </div>
            )}
            {info.Premiered && (
              <div>
                <dt className="text-muted-foreground">Premiered</dt>
                <dd>{info.Premiered}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {full?.characters && full.characters.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">Characters & Voice Actors</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {full.characters.slice(0, 18).map((c, i) => {
              const va = c.voice_actors.find((v) => v.language === "Japanese") ??
                c.voice_actors[0];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md border border-border bg-card p-2"
                >
                  <img
                    src={fixImg(c.character.images?.jpg?.image_url)}
                    alt={c.character.name}
                    loading="lazy"
                    className="h-16 w-12 flex-shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {c.character.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                  </div>
                  {va && (
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="truncate text-xs font-medium">
                          {va.person.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {va.language}
                        </p>
                      </div>
                      <img
                        src={fixImg(va.person.images?.jpg?.image_url)}
                        alt={va.person.name}
                        loading="lazy"
                        className="h-16 w-12 flex-shrink-0 rounded object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Episodes</h2>
        <EpisodeListLink id={info._id} count={info.epCount ?? 12} />
      </div>
    </Layout>
  );
}

function EpisodeListLink({ id, count }: { id: number; count: number }) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
      {Array.from({ length: count }).map((_, i) => (
        <Link
          key={i}
          to="/watch/$id/$ep"
          params={{ id: String(id), ep: String(i + 1) }}
          className="rounded-md bg-secondary py-2 text-center text-sm hover:bg-primary hover:text-primary-foreground"
        >
          {i + 1}
        </Link>
      ))}
    </div>
  );
}