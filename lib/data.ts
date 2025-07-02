import type { Category } from "@/lib/types/category";

export async function getMainCategories(): Promise<Category[]> {
  return [
    { id: 1, slug: "it", title: "IT", image: "/images/categories/IT.jpg" },
    { id: 2, slug: "exhibition", title: "Exhibition", image: "/images/categories/Exhibition.jpg" },
    { id: 3, slug: "must-try", title: "Must-Try", image: "/images/categories/Must-Try.jpg" },
    { id: 4, slug: "fashion", title: "Fashion", image: "/images/categories/Fashion.jpg" }
  ]
}