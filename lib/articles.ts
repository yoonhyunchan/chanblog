// Article functions that use database with pg
import type { Article } from "./data"
import { getArticlesByCategory, getArticleBySlug } from "./api";

export async function getCategoryPosts(cat_id: number): Promise<Article[]> {
  const Articles = await getArticlesByCategory(cat_id)
  return Articles
}

export async function getArticleData(slug: string): Promise<Article | null> {
  const Article = await getArticleBySlug(slug)
  return Article
}
