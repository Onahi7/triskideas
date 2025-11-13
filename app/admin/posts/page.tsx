"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Plus, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAllPosts, deletePost, type Post } from "@/lib/db-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ManagePostsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await getAllPosts()
      setPosts(data)
      setFilteredPosts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus === "published") {
      filtered = filtered.filter((p) => p.published)
    } else if (filterStatus === "draft") {
      filtered = filtered.filter((p) => !p.published)
    } else if (filterStatus === "featured") {
      filtered = filtered.filter((p) => p.featured)
    }

    setFilteredPosts(filtered)
  }, [searchTerm, filterStatus, posts])

  const handleDelete = (id: number) => {
    setPostToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete)
        toast({
          title: "Post deleted",
          description: "The post has been successfully deleted",
        })
        loadPosts()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive",
        })
      }
      setPostToDelete(null)
    }
    setDeleteDialogOpen(false)
  }
  }, [searchTerm, filterStatus, posts])

  const handleDelete = (id: string) => {
    setPostToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (postToDelete) {
      const updated = posts.filter((p) => p.id !== postToDelete)
      setPosts(updated)
      localStorage.setItem("blog_posts", JSON.stringify(updated))
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted",
      })
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Manage Posts</h1>
          <p className="text-gray-600 mt-1">Create and manage your blog articles</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="bg-amber-700 hover:bg-amber-800 text-white gap-2">
            <Plus size={20} />
            New Post
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "published", "draft", "featured"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status ? "bg-amber-700" : ""}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading posts...</div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 py-8">
              {searchTerm || filterStatus !== "all" ? "No posts match your filters" : "No posts yet"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <div className="flex justify-center">
                <Link href="/admin/posts/new">
                  <Button className="bg-amber-700 hover:bg-amber-800">Create First Post</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                      {post.featured && (
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-medium">
                          Featured
                        </span>
                      )}
                      {post.published ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
                          Published
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-medium">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>by {post.author}</span>
                      <span>Views: {post.viewCount || 0}</span>
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/admin/posts/edit/${post.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Edit2 size={16} />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)} className="gap-2">
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
