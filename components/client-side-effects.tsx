"use client"

import { useEffect } from "react"

export function ClientSideEffects() {
  useEffect(() => {
    // Handle sidebar toggle from header
    const handleToggleSidebar = () => {
      const sidebarElement = document.querySelector("[data-sidebar-setter]") as HTMLElement
      if (sidebarElement) {
        // This is a workaround to communicate between components
        const event = new CustomEvent("sidebar-toggle")
        sidebarElement.dispatchEvent(event)
      }
    }

    // Handle menu button click
    const handleMenuClick = () => {
      const sidebar = document.querySelector('nav[class*="translate-x"]') as HTMLElement
      const overlay = document.querySelector('[class*="bg-black/50"]') as HTMLElement

      if (sidebar && overlay) {
        const isOpen = !sidebar.classList.contains("-translate-x-full")

        if (isOpen) {
          sidebar.classList.add("-translate-x-full")
          sidebar.classList.remove("translate-x-0")
          overlay.classList.add("opacity-0", "invisible")
          overlay.classList.remove("opacity-100", "visible")
        } else {
          sidebar.classList.remove("-translate-x-full")
          sidebar.classList.add("translate-x-0")
          overlay.classList.remove("opacity-0", "invisible")
          overlay.classList.add("opacity-100", "visible")
        }
      }
    }

    // Add event listener for menu button
    const menuBtn = document.getElementById("menuBtn")
    if (menuBtn) {
      menuBtn.addEventListener("click", handleMenuClick)
    }

    window.addEventListener("toggleSidebar", handleToggleSidebar)

    // Touch/swipe support
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      const swipeThreshold = 50
      const swipeDistance = touchEndX - touchStartX
      const sidebar = document.querySelector('nav[class*="translate-x"]') as HTMLElement
      const overlay = document.querySelector('[class*="bg-black/50"]') as HTMLElement

      // Swipe right to open sidebar
      if (swipeDistance > swipeThreshold && touchStartX < 50 && sidebar && overlay) {
        sidebar.classList.remove("-translate-x-full")
        sidebar.classList.add("translate-x-0")
        overlay.classList.remove("opacity-0", "invisible")
        overlay.classList.add("opacity-100", "visible")
      }

      // Swipe left to close sidebar
      if (swipeDistance < -swipeThreshold && sidebar && overlay && !sidebar.classList.contains("-translate-x-full")) {
        sidebar.classList.add("-translate-x-full")
        sidebar.classList.remove("translate-x-0")
        overlay.classList.add("opacity-0", "invisible")
        overlay.classList.remove("opacity-100", "visible")
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("toggleSidebar", handleToggleSidebar)
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchend", handleTouchEnd)
      if (menuBtn) {
        menuBtn.removeEventListener("click", handleMenuClick)
      }
    }
  }, [])

  return null
}
