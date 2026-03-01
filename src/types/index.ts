export interface AboutThumbnailPreview {
  url: string;
  name: string;
  size: number;
}

export interface IPost {
  coverImgUrl: string;
  createdAt: string;
  description: string;
  id: number;
  searchIndex?: string | null;
  title: string;
  updatedAt: string;
  userId: string | null;
  Tags?: string[] | null;
  likeCount?: number | null;
  email?: string | null;
  reppleCount?: number;
}


export interface IUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  provider: string | null;
  created_at: string | null;
  like?: number[] | null;
  descript?: string | null;
  github?: string | null;
}

export interface IRepple {
  id: number;
  postId: number | null;
  content: string | null;
  name: string | null;
  userid?: string | null;
  createdAt: string;
  updatedat?: string | null;
}
