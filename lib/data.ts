import type { Category } from "@/lib/types/category";

export async function getMainCategories(): Promise<Category[]> {
  return [
    { id: 1, slug: "it", title: "IT", image: "/images/IT.jpeg" },
    { id: 2, slug: "exhibition", title: "Exhibition", image: "/images/Exhibition.JPG" },
    { id: 3, slug: "must-try", title: "Must-Try", image: "/images/Must-Try.JPG" },
    { id: 4, slug: "fashion", title: "Fashion", image: "/images/Fashion.jpeg" }
  ]
}