import { useQuery } from "@tanstack/react-query";
import { getTagList } from "../_lib/getTagList";
import { TagRow } from "../@sidebar/page";

type UseCurrentUserResult = {
  Tags: TagRow[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export function useTagList(email?: string): UseCurrentUserResult {
  const query = useQuery<TagRow[] | null, Error>({
    queryKey: ["Tags", email],
    enabled: !!email,
    queryFn: async () => {
      if (!email) return [];
      const result = await getTagList(email);
      return result ?? [];
    },
    staleTime: 1000 * 60,
  });
  return {
    Tags: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
