"use client"

import Link from "next/link"
import { Menu, Plane } from "lucide-react"

export function Header() {
  const handleMenuClick = () => {
    const event = new CustomEvent("toggleSidebar")
    window.dispatchEvent(event)
  }

  return (
    <header className="flex items-center justify-between px-8 py-2 border-b-2 border-black">
      <button onClick={handleMenuClick} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
        <Menu size={24} />
      </button>

      <Link href="/" className="flex items-center text-inherit no-underline">
        <Plane size={32} />
      </Link>

      <div className="w-10" /> {/* Spacer to maintain header layout */}
    </header>
  )
}
