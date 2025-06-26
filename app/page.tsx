import Image from "next/image"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { getAllCategories } from "@/lib/data"

export default async function HomePage() {
  const categories = await getAllCategories()

  // Show first 4 categories on homepage
  const displayCategories = categories.slice(0, 4)

  return (
    <Layout>
      <div className="px-6">
        {/* Hero Section */}
        <section className="text-center mb-16 mt-16 pt-4 pb-8">
          <h1 className="font-light text-[clamp(2.5rem,14vh,20rem)] leading-[0.7] tracking-tight font-[Fashion]">
            <div className="mb-2">HELLO WORLD</div>
            <div>DLROW OLLEH</div>
          </h1>
        </section>

        {/* Category Grid */}
        <section className="max-w-6xl mx-auto pb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {displayCategories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group flex flex-col h-4/5 cursor-pointer transition-transform duration-200 hover:-translate-y-1 text-inherit no-underline animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="aspect-square overflow-hidden rounded-xl mb-3 relative">
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-lg transition-all duration-1000 grayscale group-hover:scale-[1.2] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 diagonal-pattern" />
                </div>
                <h3 className="text-lg font-medium text-center">{category.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
