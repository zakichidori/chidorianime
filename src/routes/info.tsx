import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import narutoLogo from "@/assets/naruto-chibi.png";

export const Route = createFileRoute("/info")({
  head: () => ({
    meta: [
      { title: "Info — Zaki Anime" },
      { name: "description", content: "About Zaki Anime." },
    ],
  }),
  component: InfoPage,
});

function InfoPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-xl py-10">
        <div className="flex flex-col items-center text-center">
          <img
            src={narutoLogo}
            alt="Zaki Anime"
            width={160}
            height={160}
            className="h-40 w-40 object-contain"
          />
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Zaki Anime</h1>
          <p className="mt-6 text-base text-foreground">
            Made by ZakiChidori · 2026
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            Snapchat:{" "}
            <span className="font-mono text-foreground">user7042191</span>
          </p>
          <p className="mt-8 text-lg font-semibold text-primary">Have fun!</p>
        </div>
      </div>
    </Layout>
  );
}