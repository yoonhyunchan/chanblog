"use client"

import Link from "next/link"
import { Menu, Search, Plane } from "lucide-react"

export function Header() {
  const handleMenuClick = () => {
    const event = new CustomEvent("toggleSidebar")
    window.dispatchEvent(event)
  }

  const handleSearchClick = () => {
    const searchTerm = prompt("What would you like to search for?")
    if (searchTerm) {
      alert(`Searching for: ${searchTerm}`)
    }
  }

  return (
    <header className="flex items-center justify-between px-8 py-2 border-b-2 border-black">
      <button onClick={handleMenuClick} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
        <Menu size={24} />
      </button>

      <Link href="/" className="flex items-center text-inherit no-underline">
        <Plane size={32} />
      </Link>

      <button onClick={handleSearchClick} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
        <Search size={24} />
      </button>
    </header>
  )
}
