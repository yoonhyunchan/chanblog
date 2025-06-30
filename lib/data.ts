// Categories data - now using database
export interface Category {
  id: number;
  slug: string;
  title: string;
  image: string;
}


// Article interface for frontend
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

export async function getMainCategories(): Promise<Category[]> {
  return [
    { id: 1, slug: "it", title: "IT", image: "/images/IT.jpeg" },
    { id: 2, slug: "exhibition", title: "Exhibition", image: "/images/Exhibition.JPG" },
    { id: 3, slug: "must-try", title: "Must-Try", image: "/images/Must-Try.JPG" },
    { id: 4, slug: "fashion", title: "Fashion", image: "/images/Fashion.jpeg" }
  ]
}