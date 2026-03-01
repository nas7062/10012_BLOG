export default function PostClone() {
  return (
    <div className="flex flex-col gap-2 w-[330px] sm:w-[270px] h-[420px] justify-between">
      <div className="flex flex-col gap-2 shrink-0">
        <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-12 bg-muted animate-pulse rounded" />
      </div>
      <div className="flex justify-between text-xs shrink-0">
        <div className="h-4 bg-muted animate-pulse rounded w-24" />
        <div className="h-4 bg-muted animate-pulse rounded w-20" />
      </div>
      <div className="flex items-center justify-between gap-2 mt-auto shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-24" />
        </div>
      </div>
    </div>
  );
}
