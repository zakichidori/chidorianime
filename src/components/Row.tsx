import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimeCard, AnimeCardSkeleton } from "./AnimeCard";
import { normalizeCard, type AnimeCard as RawCard } from "@/lib/anime";

export function Row({
  title,
  queryKey,
  fetcher,
}: {
  title: string;
  queryKey: unknown[];
  fetcher: () => Promise<RawCard[]>;
}) {
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: fetcher,
    staleTime: 5 * 60_000,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="group/row mb-10">
      <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-r from-background/90 to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth pb-2"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px] lg:w-[200px]">
                  <AnimeCardSkeleton />
                </div>
              ))
            : (data ?? []).slice(0, 18).map((c) => (
                <div key={c._id ?? c.Id} className="w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px] lg:w-[200px]">
                  <AnimeCard a={normalizeCard(c)} />
                </div>
              ))}
        </div>
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-l from-background/90 to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}