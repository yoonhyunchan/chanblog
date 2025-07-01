// Categories
import type { Category, UpdateCategoryParams, NewCategory } from "@/lib/types/category"

const CATEGORIES_API = process.env.NEXT_PUBLIC_CATEGORIES_API_URL
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