import { Link } from "@tanstack/react-router";
import { Play, Star } from "lucide-react";
import type { AnimeInfo } from "@/lib/anime";

export function Hero({ anime }: { anime: AnimeInfo }) {
  return (
    <div className="relative mb-10 -mx-4 overflow-hidden md:-mx-8 md:rounded-lg">
      <div className="relative aspect-[16/9] max-h-[480px] w-full md:aspect-[21/9]">
        {anime.Cover && (
          <img
            src={anime.Cover}
            alt={anime.Name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10">
          <div className="max-w-xl">
            {anime.MALScore && (
              <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium text-foreground">{anime.MALScore}</span>
                {anime.Status && <span>· {anime.Status}</span>}
                {anime.epCount && <span>· {anime.epCount} eps</span>}
              </div>
            )}
            <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-5xl">
              {anime.Name}
            </h1>
            <p className="mb-4 line-clamp-3 text-sm text-muted-foreground md:text-base">
              {anime.DescripTion}
            </p>
            <div className="flex gap-3">
              <Link
                to="/watch/$id/$ep"
                params={{ id: String(anime._id), ep: "1" }}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Play className="h-4 w-4 fill-current" /> Watch
              </Link>
              <Link
                to="/anime/$id"
                params={{ id: String(anime._id) }}
                className="inline-flex items-center rounded-md border border-border bg-secondary px-5 py-2.5 text-sm font-medium hover:bg-secondary/70"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}