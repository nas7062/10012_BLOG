import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPost() {
  return (
    <div
      className="flex flex-col max-w-[300px] w-full h-[420px] shadow-lg gap-2 pb-4 rounded-md
                 cursor-pointer relative overflow-hidden"
    >
      <div className="relative w-full h-60 shrink-0">
        <Skeleton className="w-full h-full rounded-xl bg-gray-300" />
      </div>

      <div className="px-4 flex flex-col flex-1 justify-between min-h-[180px] space-y-3">
        <Skeleton className="h-5 w-3/4 bg-gray-300" />
        <Skeleton className="h-4 w-full bg-gray-300" />
        <Skeleton className="h-4 w-2/3 bg-gray-300" />
        <Skeleton className="h-4 w-1/3 bg-gray-300" />
      </div>
    </div>
  );
}