import Link from "next/link";
import { getItNewsPosts } from "./_lib/getItNewsPosts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "뉴스 페이지 | 10012",
  description: "10012 에서 최신 뉴스를 확인해봐요",
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 600;

export default async function ItNewsPage() {
  const posts = await getItNewsPosts();

  return (
    <main className=" mx-auto py-10 text-primary flex flex-col gap-10 ">
      <h1 className="text-3xl! text-center sm:text-4xl! font-bold mb-6">
        IT 최신 뉴스
      </h1>
      <ul className=" grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((p, idx) => (
          <li
            key={`${p.link}-${p.title}-${idx}`}
            className=" rounded-lg p-4 shadow-lg hover:shadow-xl transition hover:-translate-y-2 duration-300 "
          >
            <Link
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold hover:underline"
            >
              {p.title}
            </Link>
            <div className="text-sm text-gray-400 mt-1">
              {new Date(p.date).toLocaleString()} · {p.source}
            </div>
            {p.summary && (
              <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                {p.summary}
              </p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
