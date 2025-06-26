import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="bg-black text-white text-center py-8 mt-auto">
        <p className="text-sm">DESIGN BY Chan | chanandy5372@gmail.com</p>
      </footer>
    </div>
  )
}
