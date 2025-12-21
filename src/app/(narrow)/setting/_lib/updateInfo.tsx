import { getSupabaseClient } from "@/src/app/api/supabase";
import { toast } from "sonner";

interface InfoProps {
  email: string;
  thumbnailFile: File | null;
  image: string;
  name: string;
  descript: string;
  github: string;
}

export async function updateInfo({
  email,
  thumbnailFile,
  image,
  name,
  descript,
  github,
}: InfoProps) {
  const supabase = getSupabaseClient();
  let imageUrl = image;

  if (thumbnailFile) {
    const { error: uploadError } = await supabase.storage
      .from("profile")
      .upload(`profile-${email}`, thumbnailFile, {
        upsert: true,
      });

    if (uploadError) {
      toast.error("이미지 업로드 실패");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("profile")
      .getPublicUrl(`profile-${email}`);

    imageUrl = urlData.publicUrl;
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({
      name,
      descript,
      image: imageUrl,
      github,
    })
    .eq("email", email);

  if (updateError) {
    toast.error("정보 업데이트 실패");
    return;
  }

  toast.success("내 정보 변경 완료");
}
