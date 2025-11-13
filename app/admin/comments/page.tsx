"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPendingComments, approveComment, deleteComment, type Comment } from "@/lib/comment-actions"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Trash2, MessageSquare } from "lucide-react"
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

export default function AdminCommentsPage() {
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      const data = await getPendingComments()
      setComments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await approveComment(id)
      toast({
        title: "Comment approved",
        description: "The comment is now visible on the blog",
      })
      loadComments()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve comment",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (id: number) => {
    setCommentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (commentToDelete) {
      try {
        await deleteComment(commentToDelete)
        toast({
          title: "Comment deleted",
          description: "The comment has been removed",
        })
        loadComments()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete comment",
          variant: "destructive",
        })
      }
      setCommentToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Pending Comments</h1>
          <p className="text-gray-600 mt-1">Review and approve comments before they appear on the blog</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {comments.length} Pending
        </Badge>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No pending comments</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{comment.name}</p>
                        <p className="text-sm text-gray-500">{comment.email}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        Pending
                      </Badge>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                    <p className="text-xs text-gray-500">
                      Posted on {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleApprove(comment.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </Button>
                    <Button onClick={() => handleDelete(comment.id)} variant="destructive" size="sm">
                      <Trash2 size={16} className="mr-1" />
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
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
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
