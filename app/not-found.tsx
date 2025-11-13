import type { Metadata } from "next"
import { NotFoundClient } from "./not-found-client"

export const metadata: Metadata = {
  title: "Page Not Found | TRISKIDEAS",
  description: "Sorry, the page you're looking for doesn't exist. Explore our articles on human potential and personal development instead.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return <NotFoundClient />
}
