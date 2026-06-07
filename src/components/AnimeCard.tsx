import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { NormalizedCard } from "@/lib/anime";

export function AnimeCard({ a }: { a: NormalizedCard }) {
  if (!a.id) return null;
  return (
    <Link
      to="/anime/$id"
      params={{ id: String(a.id) }}
      className="group block"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted">
        {a.image ? (
          <img
            src={a.image}
            alt={a.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        {a.score && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-background/85 px-1.5 py-0.5 text-xs font-medium">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {a.score}
          </div>
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
        {a.name}
      </h3>
      {a.epCount ? (
        <p className="text-xs text-muted-foreground">{a.epCount} eps</p>
      ) : null}
    </Link>
  );
}

export function AnimeCardSkeleton() {
  return (
    <div>
      <div className="aspect-[2/3] animate-pulse rounded-md bg-muted" />
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
    </div>
  );
}