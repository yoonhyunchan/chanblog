import Image from "next/image"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { Breadcrumb } from "@/components/breadcrumb"
import { getCategoryData } from "@/lib/api/category"
import { getArticlesByCategory } from "@/lib/api/article"
import type { Article } from '@/lib/types/article';


interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryData(slug)


  if (!category) {
    return (
      <Layout>
        <div className="px-6">
          <div className="max-w-3xl mx-auto py-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
            <p className="text-gray-500">The requested category does not exist.</p>
            <Link
              href="/"
              className="inline-block mt-4 bg-black text-white px-6 py-3 rounded-none hover:bg-gray-800 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // Get posts with error handling
  let posts: Article[] = []
  let hasError = false

  try {
    posts = await getArticlesByCategory(category.id)
  } catch (error) {
    console.error("Error loading posts:", error)
    hasError = true
  }


  return (
    <Layout>
      <div>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: category.title }]} />

        <div className="px-6">
          <div className="max-w-3xl mx-auto py-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4">{category.title}</h1>
              {/* <p className="text-xl text-gray-500 max-w-2xl mx-auto">{category.description}</p> */}
            </div>

            <div className="space-y-8 pb-16">
              {hasError ? (
                <div className="text-center py-12 sm:col-span-1 md:col-span-2">
                  <p className="text-red-500 text-lg mb-4">Unable to load articles at the moment.</p>
                  <p className="text-gray-500">Please check your database connection and try again.</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 sm:col-span-1 md:col-span-2">
                  <p className="text-gray-500 text-lg">No articles found in this category.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <article
                    key={post.slug}
                    className="rounded-lg shadow-sm hover:shadow-md transition-all duration-700 hover:-translate-y-1 overflow-hidden"
                  >
                    <Link
                      href={`/article/${post.slug}`}
                      className="grid md:grid-cols-[300px_1fr] gap-6 p-6 text-inherit no-underline"
                    >
                      <div className="rounded-md overflow-hidden w-[300px] h-[200px]">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          height={200}
                          width={300}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold mb-2 text-gray-900">{post.title}</h2>
                          <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>{post.date}</span>
                          <span>By {post.author_name}</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
