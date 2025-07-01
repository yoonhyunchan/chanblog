import Image from "next/image"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { Breadcrumb } from "@/components/breadcrumb"
import { getRelatedArticles, getArticleBySlug } from "@/lib/api/article"
import { getCategoryData, getAllCategories } from "@/lib/api/category"
import { MarkdownViewer } from "@/components/markdown-viewer"

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return <div>Article not found</div>
  }
  const relatedArticles = await getRelatedArticles(article.category_id, slug)

  const allCategories = await getAllCategories()
  const matched = allCategories.find(cat => cat.id === article.category_id)
  const category = matched ? await getCategoryData(matched.slug) : null

  // Ensure tags is always an array
  const tagsArray: string[] = Array.isArray(article.tags)
    ? (article.tags as string[])
    : (typeof article.tags === 'string' && article.tags ? (article.tags as string).split(",").map((tag: string) => tag.trim()) : []);

  return (
    <Layout>
      <div>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: category?.title || 'Unknown Category', href: category ? `/category/${category.slug}` : '#' },
            { label: article.title },
          ]}
        />

        <div className="px-6">
          <article className="max-w-3xl mx-auto py-8">
            {/* Article Header */}
            <header className="mb-12 text-center">
              <div className="mb-4">
                <Link
                  href={category ? `/category/${category.slug}` : '#'}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors no-underline"
                >
                  {category?.title || 'Unknown Category'}
                </Link>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">{article.title}</h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">{article.subtitle}</p>

              <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-b border-gray-200">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={article.author_avatar_path || "/placeholder.svg?height=50&width=50"}
                      alt={article.author_name || 'Author'}
                      width={50}
                      height={50}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{article.author_name}</div>
                    <div className="text-sm text-gray-600">{article.author_title}</div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <time dateTime={article.date}>{article.date}</time>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {article.image && (
              <div className="mb-12 flex justify-center">
                <div className="rounded-xl overflow-hidden shadow-lg max-w-xl w-full h-64">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={800}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:shadow-none prose-pre:border-0">
              <div className="text-xl font-medium text-gray-900 mb-8 p-6 bg-slate-50 border-l-4 border-blue-500 rounded-lg">
                <p>{article.intro}</p>
              </div>
              <div className="mt-8">
                <MarkdownViewer content={article.content || ''} />
              </div>
            </div>

            {/* Article Footer */}
            <footer className="mt-16 pt-8 border-t-2 border-gray-200">
              {/* Tags */}
              <div className="mb-8">
                <span className="font-semibold text-gray-600 block mb-3">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {tagsArray.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </footer>
          </article>

          {/* Related Articles */}
          <section className="max-w-3xl mx-auto mt-16 pt-12 border-t-2 border-gray-200 pb-16">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <article
                  key={relatedArticle.slug}
                  className="rounded-xl shadow-sm hover:shadow-lg overflow-hidden transition-all duration-200 hover:-translate-y-1"
                >
                  <Link href={`/article/${relatedArticle.slug}`} className="block text-inherit no-underline">
                    <div className="h-48 overflow-hidden">
                      <Image
                        src={relatedArticle.image || "/placeholder.svg?height=200&width=400"}
                        alt={relatedArticle.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-3 text-gray-900 leading-tight">{relatedArticle.title}</h4>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{relatedArticle.excerpt}</p>
                      <span className="text-sm text-gray-400">{relatedArticle.date}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}
