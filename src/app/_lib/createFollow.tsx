import { getSupabaseClient } from "../api/supabase";
import { checkFollow } from "./checkFollow";

export async function createFollow(userId: string, targetId: string) {
  if (!userId || !targetId) return;

  const supabase = getSupabaseClient();

  const isFollowing = await checkFollow(userId, targetId);
  if (isFollowing) {
    return null;
  }

  // 2. 팔로우가 존재하지 않으면 새로운 팔로우 추가
  const { data: insertData, error: insertError } = await supabase
    .from("follows")
    .insert({ follower_id: userId, following_id: targetId });

  if (insertError) {
    console.error("팔로우 추가 오류", insertError);
    return null;
  }

  return insertData;
}
