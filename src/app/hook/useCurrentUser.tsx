import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../_lib/getUser";
import { getUserById } from "../_lib/getUserById";
import { IUser } from "../type";
type UseCurrentUserResult = {
  user: IUser | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

type UseUserParams = {
  id?: string;
  email?: string;
};

export function useCurrentUser(params: UseUserParams): UseCurrentUserResult {
  const { id, email } = params;

  const enabled = !!id || !!email;

  const query = useQuery<IUser | null, Error>({
    queryKey: ["user", { id, email }],
    enabled,
    queryFn: async () => {
      if (id) return getUserById(id);
      if (email) return getUserInfo(email);
      return null;
    },
    staleTime: 60 * 60,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
