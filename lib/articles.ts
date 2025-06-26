// Article functions that use database with pg
import { getArticlesByCategory, getArticleBySlugFromDb, getRelatedArticlesFromDb, transformDbArticle } from "./database"
import type { Article } from "./data"

export async function getCategoryPosts(categorySlug: string): Promise<Article[]> {
  const dbArticles = await getArticlesByCategory(categorySlug)
  return dbArticles.map(transformDbArticle)
}

export async function getArticleData(slug: string): Promise<Article | null> {
  const dbArticle = await getArticleBySlugFromDb(slug)
  return dbArticle ? transformDbArticle(dbArticle) : null
}

export async function getRelatedArticles(currentSlug: string): Promise<Article[]> {
  const currentArticle = await getArticleBySlugFromDb(currentSlug)
  if (!currentArticle) return []

  const dbRelatedArticles = await getRelatedArticlesFromDb(currentSlug, currentArticle.category_slug)
  return dbRelatedArticles.map(transformDbArticle)
}
