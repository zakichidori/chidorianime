import { useQuery } from "@tanstack/react-query";
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

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-semibold tracking-tight">{title}</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : (data ?? [])
              .slice(0, 14)
              .map((c) => <AnimeCard key={c._id ?? c.Id} a={normalizeCard(c)} />)}
      </div>
    </section>
  );
}