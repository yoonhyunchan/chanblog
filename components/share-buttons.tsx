"use client"

import { Twitter, Facebook, Linkedin } from "lucide-react"

interface ShareButtonsProps {
  title: string
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const shareArticle = (platform: string) => {
    const url = window.location.href

    let shareUrl = ""
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <span className="font-semibold text-gray-600">Share this article:</span>
      <div className="flex gap-3 flex-wrap justify-center md:justify-start">
        <button
          onClick={() => shareArticle("twitter")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-lg font-medium transition-colors hover:bg-blue-500"
        >
          <Twitter size={20} />
          Twitter
        </button>
        <button
          onClick={() => shareArticle("facebook")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700"
        >
          <Facebook size={20} />
          Facebook
        </button>
        <button
          onClick={() => shareArticle("linkedin")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-medium transition-colors hover:bg-blue-800"
        >
          <Linkedin size={20} />
          LinkedIn
        </button>
      </div>
    </div>
  )
}
