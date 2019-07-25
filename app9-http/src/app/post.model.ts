export interface PostData {
  title: string;
  content: string;
}

export interface Post extends PostData {
  id: string;
}
