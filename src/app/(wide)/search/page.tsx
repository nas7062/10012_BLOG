import SearchInput from "./_components/SearchInput";
import SearchResultList from "../../_components/SearchPostList";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const baseTitle = "검색 | 10012";
  const title = q ? `“${q}” 검색 결과 | 10012` : baseTitle;

  const description = q
    ? `“${q}”에 대한 정보와 글을 10012에서 찾아보세요.`
    : "10012에서 다양한 정보를 검색해 보세요.";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q: raw } = await searchParams;
  const q = Array.isArray(raw) ? raw[0] : (raw ?? "");

  return (
    <main className="flex flex-col justify-center mx-auto px-10  gap-8">
      <SearchInput q={q} />
      <SearchResultList q={q} />
    </main>
  );
}
