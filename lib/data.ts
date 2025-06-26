// Static categories data - no database needed
export interface Category {
  slug: string
  title: string
  description: string
  image: string
}

// Static categories that don't change often
export const categories: Category[] = [
  {
    slug: "it",
    title: "IT & Technology",
    description: "Explore the latest in technology, programming, and digital innovation.",
    image: "/images/IT.jpeg",

  },
  {
    slug: "exhibition",
    title: "Exhibition & Art",
    description: "Discover amazing exhibitions, art galleries, and cultural experiences.",
    image: "/images/Exhibition.JPG",
  },
  {
    slug: "food",
    title: "Must-Try Places",
    description: "Find the best restaurants, cafes, and food experiences in the city.",
    image: "/images/Must-Try.JPG",
  },
  {
    slug: "fashion",
    title: "Fashion & Style",
    description: "Latest trends, style guides, and fashion inspiration.",
    image: "/images/Fashion.jpeg",
  }
]

// Article interface for frontend
export interface Article {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  content: string
  intro: string
  category: string
  author: {
    name: string
    title: string
    avatar: string
  }
  date: string
  dateFormatted: string
  readTime: string
  featuredImage: string
  image: string
  tags: string[]
}

// Functions for categories (static data)
export async function getAllCategories(): Promise<Category[]> {
  return categories
}

export async function getCategoryData(slug: string): Promise<Category | null> {
  return categories.find((cat) => cat.slug === slug) || null
}
