// Utility functions for fetching articles and categories from backend APIs (client-side)

const CATEGORIES_API = process.env.NEXT_PUBLIC_CATEGORIES_AP;
const ARTICLES_API = process.env.NEXT_PUBLIC_ARTICLES_API;

export async function getAllCategoriesClient() {
    try {
        const res = await fetch(`${CATEGORIES_API}/api/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        return await res.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getCategoryDataClient(slug: string) {
    try {
        const res = await fetch(`${CATEGORIES_API}/api/categories/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch category');
        return await res.json();
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

export async function getAllArticlesClient() {
    try {
        const res = await fetch(`${ARTICLES_API}/api/articles`);
        if (!res.ok) throw new Error('Failed to fetch articles');
        return await res.json();
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

export async function getArticleDataClient(slug: string) {
    try {
        const res = await fetch(`${ARTICLES_API}/api/articles/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        return await res.json();
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
} 