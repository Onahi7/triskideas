"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createComment } from "@/lib/comment-actions"
import { MessageSquare, Reply } from "lucide-react"

interface Comment {
  id: number
  postId: number
  parentId: number | null
  name: string
  email: string
  content: string
  createdAt: Date
  replies?: Comment[]
}

interface CommentSectionProps {
  postId: number
  comments: Comment[]
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
    parentId: null as number | null,
  })
  const [loading, setLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createComment({
        postId,
        parentId: formData.parentId,
        name: formData.name,
        email: formData.email,
        content: formData.content,
      })

      if (result.success) {
        toast({
          title: "Comment submitted!",
          description: result.message,
        })
        setFormData({ name: "", email: "", content: "", parentId: null })
        setReplyingTo(null)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReply = (commentId: number, commentAuthor: string) => {
    setReplyingTo(commentId)
    setFormData({ ...formData, parentId: commentId, content: `@${commentAuthor} ` })
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setFormData({ ...formData, parentId: null, content: "" })
  }

  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment.id} className={`${depth > 0 ? "ml-8 mt-4" : "mt-6"}`}>
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900">{comment.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReply(comment.id, comment.name)}
                className="mt-2 text-amber-700 hover:text-amber-800"
              >
                <Reply size={14} className="mr-1" />
                Reply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  )

  return (
    <div className="mt-12 border-t border-gray-200 pt-12">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="text-amber-700" size={24} />
        <h3 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <Card className="mb-8 bg-amber-50">
        <CardContent className="pt-6">
          {replyingTo && (
            <div className="mb-4 p-3 bg-white rounded-lg flex items-center justify-between">
              <span className="text-sm text-gray-600">Replying to comment...</span>
              <Button variant="ghost" size="sm" onClick={cancelReply}>
                Cancel
              </Button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email * <span className="text-xs text-gray-500">(You'll be subscribed to newsletter)</span>
                </label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Comment *</label>
              <Textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your thoughts..."
                rows={4}
                className="bg-white"
              />
            </div>
            <Button type="submit" className="bg-amber-700 hover:bg-amber-800" disabled={loading}>
              {loading ? "Submitting..." : "Post Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  )
}
