import Modal from "@/src/app/_components/Modal";

export default function SinglePostLayout({
  children,
  sidebar,
  list,
  modal,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  list: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <div
        className="
        mx-auto grid gap-6 px-4 py-6
        lg:grid-cols-[100px_minmax(0,1fr)_220px] lg:max-w-[100vw]
      "
      >
        {/* 좌측 사이드바 */}
        <aside className="hidden lg:block">
          <div className="fixed top-[150] h-[calc(50vh-1.5rem)] overflow-auto  pr-4">
            {sidebar}
          </div>
        </aside>

        {/* 본문 */}
        <article className="min-w-0">
          <div className="mx-auto max-w-[860px]">{children}</div>
        </article>

        {/* 우측 리스트 */}
        <aside className="hidden lg:block">
          <div className="fixed top-[150] w-[220px] h-[calc(80vh-1.5rem)] overflow-auto pl-4">
            {list}
          </div>
        </aside>
      </div>
      {modal}
    </main>
  );
}
