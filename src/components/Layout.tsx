import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Search, Bookmark, History, Info } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import narutoLogo from "@/assets/naruto-chibi.png";
import sasukeAsset from "@/assets/sasuke-chibi.png.asset.json";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Browse" },
  { to: "/bookmarks", label: "My List" },
  { to: "/history", label: "Continue Watching" },
  { to: "/info", label: "About" },
] as const;

const GENRES = [
  "action", "adventure", "comedy", "drama", "fantasy",
  "romance", "sci-fi", "slice of life", "sports", "supernatural", "thriller",
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <img
        src={narutoLogo}
        alt="Chidori Anime"
        width={36}
        height={36}
        className="h-9 w-9 object-contain transition-transform group-hover:scale-110"
      />
      <span className="whitespace-nowrap text-xl font-bold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))]">
        CHIDORI ANIME
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/60 shadow-lg shadow-black/30"
            : "bg-gradient-to-b from-background/90 to-transparent"
        }`}
      >
        <div className="flex items-center gap-6 px-4 py-3 md:px-10">
          <Logo />
          <nav className="ml-2 hidden items-center gap-5 md:flex">
            {navItems.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto hidden md:block">
            <NavSearch />
          </div>
        </div>
      </header>

      <div className="pt-16">
        <main className="pb-24 md:pb-10">{children}</main>

        <footer className="mt-12 border-t border-border bg-sidebar/60 px-4 py-10 md:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <img src={narutoLogo} alt="" className="h-7 w-7" />
                <span className="font-bold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))]">
                  CHIDORI ANIME
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Stream anime in HD · Sub & Dub · Always free
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Browse</h4>
              <ul className="space-y-1.5 text-sm">
                <li><Link to="/" className="text-foreground/80 hover:text-primary">Home</Link></li>
                <li><Link to="/search" className="text-foreground/80 hover:text-primary">All Anime</Link></li>
                <li><Link to="/bookmarks" className="text-foreground/80 hover:text-primary">My List</Link></li>
                <li><Link to="/history" className="text-foreground/80 hover:text-primary">Continue Watching</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Genres</h4>
              <ul className="grid grid-cols-2 gap-y-1.5 text-sm">
                {GENRES.slice(0, 8).map((g) => (
                  <li key={g}>
                    <Link to="/search" search={{ genre: g } as any} className="capitalize text-foreground/80 hover:text-primary">
                      {g}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <img
                src={sasukeAsset.url}
                alt="Sasuke"
                loading="lazy"
                className="h-40 w-auto object-contain drop-shadow-[0_10px_30px_oklch(0.65_0.22_255/0.4)]"
              />
              <p className="mt-3 text-xs text-muted-foreground">© 2026 zakichidori</p>
            </div>
          </div>
        </footer>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-sidebar/95 backdrop-blur md:hidden">
        {[
          { to: "/", label: "Home", icon: Search },
          { to: "/search", label: "Browse", icon: Search },
          { to: "/bookmarks", label: "List", icon: Bookmark },
          { to: "/history", label: "History", icon: History },
          { to: "/info", label: "Info", icon: Info },
        ].map((item) => {
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