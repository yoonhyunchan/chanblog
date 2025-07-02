import type { Article, ArticlePayload } from "@/lib/types/article";
import type { ArticleFormValues } from "@/components/article-form";
import { getAuthHeaders } from "@/lib/api/login";

const ARTICLES_API = process.env.NEXT_PUBLIC_ARTICLES_API_URL


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