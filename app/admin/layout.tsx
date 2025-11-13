"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminAuth")
    if (!isLoggedIn) {
      router.push("/admin/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="transition-all duration-300 md:ml-64 ml-20 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
