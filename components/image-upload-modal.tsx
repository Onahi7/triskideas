"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadModalProps {
  onUploadSuccess: (url: string) => void
  currentImage?: string
  triggerLabel?: string
}

export function ImageUploadModal({ onUploadSuccess, currentImage, triggerLabel = "Upload Image" }: ImageUploadModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string>(currentImage || "")
  const { toast } = useToast()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "")

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      if (data.secure_url) {
        setPreview(data.secure_url)
        onUploadSuccess(data.secure_url)
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        })
        setOpen(false)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview("")
    onUploadSuccess("")
    toast({
      title: "Image removed",
      description: "The image has been removed",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="gap-2 bg-transparent">
          <Upload size={16} />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {preview ? (
            <div className="space-y-4">
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
              <div className="flex gap-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    disabled={loading}
                    asChild
                  >
                    <span>
                      <Upload size={16} className="mr-2" />
                      {loading ? "Uploading..." : "Change Image"}
                    </span>
                  </Button>
                </label>
                <Button type="button" variant="destructive" onClick={handleRemoveImage} className="gap-2">
                  <X size={16} />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF up to 10MB</p>
              <label>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={loading} />
                <Button type="button" className="bg-amber-700 hover:bg-amber-800 cursor-pointer" disabled={loading} asChild>
                  <span>
                    <Upload size={16} className="mr-2" />
                    {loading ? "Uploading..." : "Select Image"}
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
