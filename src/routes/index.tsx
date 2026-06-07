import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { Row } from "@/components/Row";
import { ContinueWatching } from "@/components/ContinueWatching";
import { findByGenre, findByRating, getAnimeInfo, getLastId } from "@/lib/anime";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chidori Anime" },
      { name: "description", content: "Chidori Anime — streaming platform" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: hero } = useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const top = await findByRating(1);
      const first = top.AniData?.[0];
      if (!first?._id) return null;
      return getAnimeInfo(first._id);
    },
    staleTime: 30 * 60_000,
  });

  return (
    <Layout>
      {hero && <Hero anime={hero} />}
      <ContinueWatching />
      <Row
        title="Top Rated"
        queryKey={["top-rated"]}
        fetcher={async () => (await findByRating(1)).AniData}
      />
      <Row
        title="Recently Added"
        queryKey={["recent"]}
        fetcher={async () => {
          const last = await getLastId();
          const ids = Array.from({ length: 14 }, (_, i) => last - i).filter((n) => n > 0);
          const results = await Promise.allSettled(ids.map((id) => getAnimeInfo(id)));
          return results
            .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
            .map((r) => r.value);
        }}
      />
      <Row
        title="Trending Action"
        queryKey={["genre", "action"]}
        fetcher={async () => (await findByGenre("action", 1)).wholePage}
      />
      <Row
        title="Romance"
        queryKey={["genre", "romance"]}
        fetcher={async () => (await findByGenre("romance", 1)).wholePage}
      />
      <Row
        title="Fantasy"
        queryKey={["genre", "fantasy"]}
        fetcher={async () => (await findByGenre("fantasy", 1)).wholePage}
      />
      <Row
        title="Comedy"
        queryKey={["genre", "comedy"]}
        fetcher={async () => (await findByGenre("comedy", 1)).wholePage}
      />
      <Row
        title="Adventure"
        queryKey={["genre", "adventure"]}
        fetcher={async () => (await findByGenre("adventure", 1)).wholePage}
      />
    </Layout>
  );
}
