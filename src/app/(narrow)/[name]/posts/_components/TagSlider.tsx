"use client";

import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/src/app/hook/useCurrentUser";
import { useTagList } from "../_hook/useTagList";
import { Spinner } from "@/components/ui/spinner";

export function TagSlider() {
  const id = usePathname().split("/")[1];
  const router = useRouter();
  const pathname = usePathname();
  const { user: userData, isLoading: isUserLoading } = useCurrentUser({
    id,
  });
  const email = userData?.email as string;
  const selectTag = (tag: string) => {
    router.push(`${pathname}?tag=${tag}`);
  };
  const { Tags, isLoading: isTagsLoading } = useTagList(email);
  const tagList = new Map<string, number>();

  if (!Tags) return;
  Tags.forEach((row) => {
    const tagrow = row.Tags ?? [];
    tagrow.forEach((tag: string) => {
      const prev = tagList.get(tag) ?? 0;
      tagList.set(tag, prev + 1);
    });
  });
  if (isUserLoading || isTagsLoading) return <Spinner className="size-6 text-green-500" />;;
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-4xl"
    >
      <CarouselContent className="flex">
        {Array.from(tagList.entries()).map(([tag, count]) => (
          <CarouselItem
            key={tag}
            className="basis-1/3 sm:basis-1/5 block lg:hidden"
          >
            <div className="py-1 w-auto ">
              <div
                className="border rounded-xl bg-green-400 text-white hover:bg-green-500"
                onClick={() => selectTag(tag)}
              >
                <CardContent className=" w-auto flex text-xs  items-center justify-center px-2 py-1">
                  <span className="font-semibold">{tag}</span>
                  <span>({count})</span>
                </CardContent>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
