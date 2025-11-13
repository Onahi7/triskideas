"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Image from "next/image"

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void
}

export function CloudinaryUpload({ onUploadSuccess }: CloudinaryUploadProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string>("")

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      const data = await response.json()
      if (data.secure_url) {
        setPreview(data.secure_url)
        onUploadSuccess(data.secure_url)
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={loading} />
          <Button as="span" variant="outline" className="cursor-pointer bg-transparent" disabled={loading}>
            <Upload size={16} className="mr-2" />
            {loading ? "Uploading..." : "Upload Image"}
          </Button>
        </label>
      </div>
      {preview && (
        <div className="relative w-full h-48">
          <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover rounded-lg" />
        </div>
      )}
    </div>
  )
}
