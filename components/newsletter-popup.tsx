"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { shouldShowNewsletterPopup, recordNewsletterPopupShown } from "@/lib/newsletter-popup-actions"
import { subscribeEmail } from "@/lib/db-actions"

export function NewsletterPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [visitorId, setVisitorId] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Generate or retrieve visitor ID from localStorage
    let id = localStorage.getItem("visitorId")
    if (!id) {
      id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("visitorId", id)
    }
    setVisitorId(id)

    // Check if popup should be shown
    const checkAndShow = async () => {
      const shouldShow = await shouldShowNewsletterPopup(id)
      if (shouldShow) {
        // Delay popup by 3 seconds for better UX
        setTimeout(() => {
          setOpen(true)
          recordNewsletterPopupShown(id)
        }, 3000)
      }
    }

    checkAndShow()
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await subscribeEmail(email)
      if (result.success) {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter.",
        })
        setOpen(false)
        setEmail("")
      } else {
        toast({
          title: "Notice",
          description: result.message,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Mail className="text-amber-700" size={24} />
          </div>
          <DialogTitle className="text-center text-2xl">Stay Connected!</DialogTitle>
          <DialogDescription className="text-center">
            Join our newsletter to receive the latest articles and insights directly in your inbox.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubscribe} className="space-y-4 mt-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800" disabled={loading}>
            {loading ? "Subscribing..." : "Subscribe Now"}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>

        <button
          onClick={handleClose}
          className="text-sm text-gray-500 hover:text-gray-700 text-center w-full mt-2"
        >
          Maybe later
        </button>
      </DialogContent>
    </Dialog>
  )
}
