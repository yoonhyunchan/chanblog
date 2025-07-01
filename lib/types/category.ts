export interface Category {
    id: number;
    slug: string;
    title: string;
    image: string;
}

export interface UpdateCategoryParams {
    slug: string
    updates: {
        title?: string
        image?: string
    }
}
export interface NewCategory {
    title: string
    image: string
}