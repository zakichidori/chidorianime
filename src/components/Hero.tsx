import { Link } from "@tanstack/react-router";
import { Play, Plus, Star } from "lucide-react";
import type { AnimeInfo } from "@/lib/anime";

export function Hero({ anime }: { anime: AnimeInfo }) {
  return (
    <div className="relative -mt-16 mb-10 overflow-hidden">
      <div className="relative h-[85vh] min-h-[520px] w-full">
        {anime.Cover && (
          <img
            src={anime.Cover}
            alt={anime.Name}
            referrerPolicy="no-referrer"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-16 md:px-12 md:pb-24">
          <div className="max-w-2xl">
            {anime.MALScore && (
              <div className="mb-3 flex items-center gap-2 text-sm text-foreground/80">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium text-foreground">{anime.MALScore}</span>
                {anime.Status && <span>· {anime.Status}</span>}
                {anime.epCount && <span>· {anime.epCount} eps</span>}
              </div>
            )}
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight drop-shadow-[0_4px_20px_oklch(0_0_0/0.8)] md:text-6xl lg:text-7xl">
              {anime.Name}
            </h1>
            <p className="mb-6 line-clamp-3 max-w-xl text-base text-foreground/80 drop-shadow md:text-lg">
              {anime.DescripTion}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/watch/$id/$ep"
                params={{ id: String(anime._id), ep: "1" }}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3 text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-105 hover:brightness-110"
              >
                <Play className="h-5 w-5 fill-current" /> Play
              </Link>
              <Link
                to="/anime/$id"
                params={{ id: String(anime._id) }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/70 px-7 py-3 text-base font-semibold backdrop-blur transition hover:bg-secondary"
              >
                <Plus className="h-5 w-5" /> More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}