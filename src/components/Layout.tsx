import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, Search, Bookmark, History, Info } from "lucide-react";
import { type ReactNode, useState } from "react";
import narutoLogo from "@/assets/naruto-chibi.png";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { to: "/history", label: "History", icon: History },
  { to: "/info", label: "Info", icon: Info },
] as const;

const GENRES = [
  "action", "adventure", "comedy", "drama", "fantasy",
  "romance", "sci-fi", "slice of life", "sports", "supernatural", "thriller",
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src={narutoLogo}
        alt="Zaki Anime"
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
      />
      <span className="whitespace-nowrap text-lg font-bold tracking-tight">
        Zaki Anime
      </span>
    </Link>
  );
}

function NavSearch() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim())
          navigate({ to: "/search", search: { q: q.trim() } as any });
      }}
      className="relative w-full max-w-md"
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search anime"
        className="w-full rounded-md border border-border bg-secondary py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </form>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-border bg-sidebar md:flex md:flex-col">
        <div className="px-5 py-5">
          <Logo />
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="md:pl-56">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="md:hidden">
            <Logo />
          </div>
          <div className="ml-auto hidden flex-1 md:flex">
            <NavSearch />
          </div>
        </header>

        <div className="scrollbar-hide -mb-2 flex gap-2 overflow-x-auto border-b border-border bg-background/60 px-4 py-2 md:px-8">
          {GENRES.map((g) => (
            <Link
              key={g}
              to="/search"
              search={{ genre: g } as any}
              className="whitespace-nowrap rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs capitalize text-muted-foreground hover:border-primary hover:text-primary"
            >
              {g}
            </Link>
          ))}
        </div>

        <main className="px-4 pb-24 pt-6 md:px-8 md:pb-10">{children}</main>

        <footer className="mt-12 border-t border-border bg-sidebar/40 px-4 py-8 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold">Zaki Anime</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Stream anime in HD · Sub & Dub · No ads on us
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <Link to="/search" className="hover:text-primary">Browse</Link>
              <Link to="/bookmarks" className="hover:text-primary">My List</Link>
              <Link to="/history" className="hover:text-primary">Continue Watching</Link>
              <Link to="/info" className="hover:text-primary">About</Link>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 zakichidori</p>
          </div>
        </footer>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-sidebar md:hidden">
        {navItems.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}