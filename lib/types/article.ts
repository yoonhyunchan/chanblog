export interface Article {
    id: number;
    slug: string;
    title: string;
    subtitle?: string;
    excerpt?: string;
    intro?: string;
    content?: string;
    category_id: number;
    date?: string;
    image?: string;
    tags?: string[];
    author_name?: string;
    author_title?: string;
    author_avatar_path?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ArticlePayload {
    slug: string;
}