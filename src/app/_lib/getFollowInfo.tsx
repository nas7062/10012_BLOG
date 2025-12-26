import { getSupabaseClient } from "../api/supabase";
import { IUser } from "../type";

export async function getFollowInfo(userId: string) {
  if (!userId) return null;

  const supabase = getSupabaseClient();

  // 1. 내가 팔로우하는 사람들 (following)
  const { data: followingRows, error: followingError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (followingError) {
    console.error("팔로잉 목록 조회 오류", followingError);
    return null;
  }

  const followingIds =
    followingRows?.map((row: { following_id: string }) => row.following_id) ??
    [];

  // 2. 나를 팔로우하는 사람들 (followers)
  const { data: followerRows, error: followerError } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("following_id", userId);

  if (followerError) {
    console.error("팔로워 목록 조회 오류", followerError);
    return null;
  }

  const followerIds =
    followerRows?.map((row: { follower_id: string }) => row.follower_id) ?? [];

  // 3. users 테이블에서 실제 유저 정보 조회

  let followingUsers: IUser[] = [];
  if (followingIds.length > 0) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .in("id", followingIds);

    if (error) {
      console.error("팔로잉 유저 정보 조회 오류", error);
      return null;
    }
    followingUsers = data ?? [];
  }

  let followerUsers: IUser[] = [];
  if (followerIds.length > 0) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .in("id", followerIds);

    if (error) {
      console.error("팔로워 유저 정보 조회 오류", error);
      return null;
    }
    followerUsers = data ?? [];
  }

  return {
    followerCount: followerIds.length ?? 0,
    followingCount: followingIds.length ?? 0,
    followers: followerUsers,
    followings: followingUsers,
  };
}
