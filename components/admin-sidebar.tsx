"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FileText, LogOut, Menu, X, Calendar, Mail, Tag, BookOpen, MessageSquare, Users, Settings2 } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

    const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Posts", path: "/admin/posts", icon: FileText },
    { name: "Events", path: "/admin/events", icon: Calendar },
    { name: "Series", path: "/admin/series", icon: BookOpen },
    { name: "Categories", path: "/admin/categories", icon: Tag },
    { name: "Comments", path: "/admin/comments", icon: MessageSquare },
    { name: "Subscribers", path: "/admin/subscribers", icon: Users },
    { name: "Settings", path: "/admin/settings", icon: Settings2 },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    router.push("/admin/login")
  }

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isOpen ? 256 : 80 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen bg-gradient-to-b from-amber-900 to-amber-950 text-white z-40 overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-amber-800">
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <Image
                  src="/Gemini_Generated_Image_koz312koz312koz3.png"
                  alt="TRISKIDEAS Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <h1 className="text-xl font-bold truncate">TRISKIDEAS</h1>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <Image
                  src="/Gemini_Generated_Image_koz312koz312koz3.png"
                  alt="TRISKIDEAS Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-amber-800 rounded transition"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2 h-[calc(100vh-120px)] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path || pathname.startsWith(item.path + "/")

            return (
              <Link key={item.path} href={item.path}>
                <motion.button
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-amber-700 text-white" : "hover:bg-amber-800 text-amber-100"
                  }`}
                >
                  <Icon size={20} />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <motion.button
            whileHover={{ x: 4 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-amber-100 hover:bg-amber-800 transition"
          >
            <LogOut size={20} />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="truncate"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

    </>
  )
}
