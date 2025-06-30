import type { Category, Article } from "./data"
import type { ArticleFormValues } from "@/components/article-form";

const CATEGORIES_API = process.env.NEXT_PUBLIC_CATEGORIES_API_URL
const ARTICLES_API = process.env.NEXT_PUBLIC_ARTICLES_API_URL

interface UpdateCategoryParams {
    slug: string
    updates: {
        title?: string
        image?: string
    }
}
interface NewCategory {
    title: string
    image: string
}
interface ArticlePayload {
    slug: string;
}

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType');

    if (!token || !tokenType) return {};

    return {
        'Authorization': `${tokenType} ${token}`
    };
}

// Categories
export async function getCategoryData(slug: string): Promise<Category | null> {
    try {
        const response = await fetch(`${CATEGORIES_API}/api/categories/${slug}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch category: ${response.statusText}`)
        }
        const category = await response.json()
        return category as Category
    } catch (error) {
        console.error("Error fetching category from API:", error)
        return null
    }
}

export async function getAllCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${CATEGORIES_API}/api/categories`)
        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`)
        }
        const categories = await response.json()
        return categories as Category[]
    } catch (error) {
        console.error('Error fetching categories from API:', error)
        // Fallback to static categories if API fails
        return [
            { id: 1, slug: "it", title: "IT", image: "/images/IT.jpeg" },
            { id: 2, slug: "exhibition", title: "Exhibition", image: "/images/Exhibition.JPG" },
            { id: 3, slug: "food", title: "Food", image: "/images/Must-Try.JPG" },
            { id: 4, slug: "fashion", title: "Fashion", image: "/images/Fashion.jpeg" }
        ]
    }
}

export async function updateCategory({ slug, updates }: UpdateCategoryParams): Promise<void> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        //   ...getAuthHeaders?.() // 인증 헤더 함수가 있다면
    }

    const response = await fetch(`${CATEGORIES_API}/api/categories`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ slug, updates })
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "Failed to update category")
    }
}

export async function addCategory(newCategory: NewCategory): Promise<void> {
    const slug = newCategory.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const response = await fetch(`${CATEGORIES_API}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            slug,
            title: newCategory.title,
            image: newCategory.image
        })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to add category");
    }
}

export async function deleteCategory(slug: string): Promise<void> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...getAuthHeaders()
    };

    const response = await fetch(`${CATEGORIES_API}/api/categories`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ slug }),
    });

    if (!response.ok) {
        throw new Error("Failed to delete category");
    }
}


// Articles
export async function getAllArticles(): Promise<Article[]> {
    try {
        const response = await fetch(`${ARTICLES_API}/api/articles`)
        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.statusText}`)
        }
        const articles = await response.json()
        return articles as Article[]
    } catch (error) {
        console.error("Error fetching article from API:", error)
        return []
    }
}

export async function getArticlesByCategory(cat_id: number): Promise<Article[]> {
    try {
        const response = await fetch(`${ARTICLES_API}/api/articles?category_id=${cat_id}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.statusText}`)
        }
        const articles = await response.json()
        return articles as Article[]
    } catch (error) {
        console.error("Error fetching article from API:", error)
        return []
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const response = await fetch(`${ARTICLES_API}/api/articles/slug/${slug}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch Article: ${response.statusText}`)
        }
        const article = await response.json()
        return article as Article
    } catch (error) {
        console.error("Error fetching Article from API:", error)
        return null
    }
}


export async function getRelatedArticles(cat_id: number, currentSlug: string): Promise<Article[]> {
    try {
        const response = await fetch(`${ARTICLES_API}/api/articles/related?category_id=${cat_id}&exclude_slug=${currentSlug}`)

        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.statusText}`)
        }
        const articles = await response.json()
        return articles as Article[]
    } catch (error) {
        console.error("Error fetching article from API:", error)
        return []
    }
}

export async function updateArticle(payload: ArticlePayload): Promise<void> {
    const response = await fetch(`${ARTICLES_API}/api/articles/${payload.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update article");
    }
}

export async function createArticle(data: ArticleFormValues): Promise<void> {
    const response = await fetch(`${ARTICLES_API}/api/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create article");
    }
}


export async function deleteArticle(slug: string): Promise<void> {
    const headers: HeadersInit = {
        ...getAuthHeaders()
    };

    const response = await fetch(`${ARTICLES_API}/api/articles/${slug}`, {
        method: "DELETE",
        headers
    });

    if (!response.ok) {
        throw new Error("Failed to delete article");
    }
}




