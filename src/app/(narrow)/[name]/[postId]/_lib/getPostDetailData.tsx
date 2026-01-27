import { getPostById } from "./getPostById";
import { getPostUser } from "@/src/app/_lib/getPostUser";
import { getCommentsByPost } from "./getComment";
import { createSupabaseServerClient } from "@/src/app/api/supabaseSever";

export async function getPostDetailData(postId: number, userEmail?: string) {
  try {
    const [post, postUserResult, comments] = await Promise.all([
      getPostById(postId),
      getPostUser(postId),
      getCommentsByPost(postId),
    ]);

    // 현재 사용자 정보 (선택적)
    let currentUser = null;
    if (userEmail) {
      try {
        const supabase = await createSupabaseServerClient();
        const { data } = await supabase
          .from("users")  
          .select("*")
          .eq("email", userEmail)
          .single();
        currentUser = data;
      } catch (error) {
        // 사용자 정보 가져오기 실패해도 계속 진행
        console.error("Failed to fetch current user:", error);
      }
    }

    return {
      post: post ?? null,
      writeUser: postUserResult?.user ?? null,
      comments: comments ?? [],
      user: currentUser,
      isUpdate: post?.email === userEmail,
    };
  } catch (error) {
    console.error("Failed to fetch post detail data:", error);
    // 에러가 발생해도 기본값 반환
    return {
      post: null,
      writeUser: null,
      comments: [],
      user: null,
      isUpdate: false,
    };
  }
}