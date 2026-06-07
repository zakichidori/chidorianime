import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { getAnimeInfo } from "@/lib/anime";
import { getEpisodes } from "@/lib/watch";
import { useLibrary } from "@/lib/store";

export const Route = createFileRoute("/watch/$id/$ep")({
  component: WatchPage,
});

function WatchPage() {
  const { id, ep } = Route.useParams();
  const epNum = Math.max(1, parseInt(ep, 10) || 1);
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data: info } = useQuery({
    queryKey: ["info", id],
    queryFn: () => getAnimeInfo(id),
    staleTime: 10 * 60_000,
  });

  const { data: streams, isLoading } = useQuery({
    queryKey: ["episodes", id],
    queryFn: () => getEpisodes(id),
    staleTime: 15 * 60_000,
  });

  const record = useLibrary((s) => s.recordWatch);

  const current = streams?.episodes.find((e) => e.number === epNum);
  const total = streams?.episodes.length ?? info?.epCount ?? epNum;
  const hasPrev = epNum > 1;
  const hasNext = epNum < total;

  useEffect(() => {
    if (info) {
      record({
        id: info._id,
        title: info.Name,
        poster: info.ImagePath,
        episode: epNum,
        timestamp: Date.now(),
      });
    }
  }, [info, epNum, record]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft" && hasPrev) {
        navigate({ to: "/watch/$id/$ep", params: { id, ep: String(epNum - 1) } });
      }
      if (e.key === "ArrowRight" && hasNext) {
        navigate({ to: "/watch/$id/$ep", params: { id, ep: String(epNum + 1) } });
      }
      if (e.key === "f" && iframeRef.current) {
        iframeRef.current.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [epNum, hasPrev, hasNext, id, navigate]);

  return (
    <Layout>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading stream…
              </div>
            ) : current ? (
              <iframe
                key={current.src}
                ref={iframeRef}
                src={current.src}
                className="h-full w-full border-0"
                allowFullScreen
                referrerPolicy="no-referrer"
                loading="eager"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Episode unavailable
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              {info && (
                <Link
                  to="/anime/$id"
                  params={{ id }}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {info.Name}
                </Link>
              )}
              <h1 className="text-xl font-semibold">Episode {epNum}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={!hasPrev}
                onClick={() =>
                  navigate({
                    to: "/watch/$id/$ep",
                    params: { id, ep: String(epNum - 1) },
                  })
                }
                className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button
                disabled={!hasNext}
                onClick={() =>
                  navigate({
                    to: "/watch/$id/$ep",
                    params: { id, ep: String(epNum + 1) },
                  })
                }
                className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Shortcuts: ← prev · → next · f fullscreen
          </p>
        </div>

        <aside className="lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Episodes
          </h2>
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-5">
            {Array.from({ length: total }).map((_, i) => {
              const n = i + 1;
              const active = n === epNum;
              return (
                <Link
                  key={n}
                  to="/watch/$id/$ep"
                  params={{ id, ep: String(n) }}
                  className={`rounded py-2 text-center text-sm ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/70"
                  }`}
                >
                  {n}
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </Layout>
  );
}