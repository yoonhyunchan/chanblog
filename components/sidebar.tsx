"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Home, Monitor, ImageIcon, Utensils, Shirt, Plane, User } from "lucide-react"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const categories = [
    { href: "/", label: "Home", icon: Home },
    { href: "/category/it", label: "IT & Technology", icon: Monitor },
    { href: "/category/exhibition", label: "Exhibition & Art", icon: ImageIcon },
    { href: "/category/food", label: "Must-Try Places", icon: Utensils },
    { href: "/category/fashion", label: "Fashion & Style", icon: Shirt },
    { href: "/category/travel", label: "Travel & Adventure", icon: Plane },
    { href: "/category/lifestyle", label: "Lifestyle", icon: User },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    const handleToggleSidebar = () => {
      setIsOpen((prev) => !prev)
    }

    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("toggleSidebar", handleToggleSidebar)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("toggleSidebar", handleToggleSidebar)
    }
  }, [isOpen])

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[998] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 w-70 h-full bg-white shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-[999] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="py-4">
          <ul className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = pathname === category.href || pathname.startsWith(category.href + "/")

              return (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className={`flex items-center px-6 py-3 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 ${
                      isActive ? "bg-blue-500 text-white hover:bg-blue-600" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} className="mr-3 flex-shrink-0" />
                    <span>{category.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
