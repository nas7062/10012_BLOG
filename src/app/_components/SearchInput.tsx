import { Search } from "lucide-react";

type Props = {
  searchParams?: string;
};

export default function SearchInput({ searchParams }: Props) {
  return (
    <form action="/search" method="GET" className="relative w-full max-w-xl">
      <input
        type="search"
        role="search"
        name="q"
        placeholder="검색어를 입력하세요."
        defaultValue={searchParams}
        autoComplete="off"
        enterKeyHint="search"
        className="w-full h-10 rounded-2x placeholder:text-sm text-sm sm:text-base border font-normal rounded-xl border-gray-300 pl-7 pr-1 outline-none transition-colors duration-200 focus:border-gray-500"
        aria-label="검색어 입력"
      />
      <Search
        className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
        aria-hidden="true"
      />
    </form>
  );
}
