import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="pt-8 px-8 pb-8 border-b border-gray-200">
      <div className="flex items-center text-sm text-gray-500 flex-wrap">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight size={16} className="mx-2" />}
            {item.href ? (
              <Link href={item.href} className="text-blue-500 hover:text-blue-700 transition-colors no-underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
