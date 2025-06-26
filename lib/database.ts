// Database configuration using pg with connection pool
import { Pool } from "pg"
import type { Article } from "./data"

// Database connection pool
let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    })
  }
  return pool
}

// Database types for articles
export interface DbArticle {
  id: number
  slug: string
  title: string
  subtitle: string
  excerpt: string
  content: string
  intro: string
  category_slug: string
  author_name: string
  author_title: string
  author_avatar: string
  published_date: Date
  read_time: string
  featured_image: string
  image: string
  tags: string[]
  created_at: Date
  updated_at: Date
}

// Database queries for articles only
export async function getArticlesByCategory(categorySlug: string): Promise<DbArticle[]> {
  try {
    const pool = getPool()
    const result = await pool.query(
      "SELECT * FROM articles WHERE category_slug = $1 ORDER BY published_date DESC",
      [categorySlug]
    )
    return result.rows as DbArticle[]
  } catch (error) {
    console.error("Error fetching articles by category:", error)
    return []
  }
}

export async function getArticleBySlugFromDb(slug: string): Promise<DbArticle | null> {
  try {
    const pool = getPool()
    const result = await pool.query("SELECT * FROM articles WHERE slug = $1", [slug])
    return (result.rows[0] as DbArticle) || null
  } catch (error) {
    console.error("Error fetching article:", error)
    return null
  }
}

export async function getRelatedArticlesFromDb(currentSlug: string, categorySlug: string): Promise<DbArticle[]> {
  try {
    const pool = getPool()
    const result = await pool.query(
      "SELECT * FROM articles WHERE category_slug = $1 AND slug != $2 ORDER BY published_date DESC LIMIT 2",
      [categorySlug, currentSlug]
    )
    return result.rows as DbArticle[]
  } catch (error) {
    console.error("Error fetching related articles:", error)
    return []
  }
}

// Helper function to transform DB data to frontend format
export function transformDbArticle(dbArticle: DbArticle): Article {
  return {
    slug: dbArticle.slug,
    title: dbArticle.title,
    subtitle: dbArticle.subtitle,
    excerpt: dbArticle.excerpt,
    content: dbArticle.content,
    intro: dbArticle.intro,
    category: dbArticle.category_slug,
    author: {
      name: dbArticle.author_name,
      title: dbArticle.author_title,
      avatar: dbArticle.author_avatar,
    },
    date: dbArticle.published_date.toISOString().split("T")[0],
    dateFormatted: new Date(dbArticle.published_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: dbArticle.read_time,
    featuredImage: dbArticle.featured_image,
    image: dbArticle.image,
    tags: dbArticle.tags,
  }
}

// Test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const pool = getPool()
    await pool.query("SELECT 1")
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

// Close database connection (useful for cleanup)
export async function closeDatabaseConnection(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
