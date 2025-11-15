"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Check, X } from "lucide-react"
import Image from "next/image"

export default function TestUploadPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null)

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "ml_default") // Try default unsigned preset first

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dhq6wt10m"
      console.log("Uploading to Cloudinary:", cloudName)
      console.log("Using preset: ml_default")
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()
      console.log("Response:", data)
      
      if (response.ok && data.secure_url) {
        setResult({
          success: true,
          url: data.secure_url,
        })
      } else {
        setResult({
          success: false,
          error: data.error?.message || JSON.stringify(data),
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Cloudinary Upload Test</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Image Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Cloud Name:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dhq6wt10m"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Upload Preset:</strong> ml_default (Cloudinary default unsigned preset)
              </p>
              <p className="text-xs text-orange-600 mt-2">
                ⚠️ If this fails, you need to create an unsigned upload preset in your Cloudinary dashboard
              </p>
            </div>

            <div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTestUpload}
                  className="hidden"
                  disabled={loading}
                />
                <Button
                  type="button"
                  className="w-full"
                  disabled={loading}
                  asChild
                >
                  <span className="flex items-center justify-center">
                    <Upload size={20} className="mr-2" />
                    {loading ? "Uploading..." : "Select and Upload Image"}
                  </span>
                </Button>
              </label>
            </div>

            {result && (
              <div className={`p-4 rounded-lg ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <Check className="text-green-600 shrink-0 mt-1" size={20} />
                  ) : (
                    <X className="text-red-600 shrink-0 mt-1" size={20} />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${result.success ? "text-green-900" : "text-red-900"}`}>
                      {result.success ? "Upload Successful!" : "Upload Failed"}
                    </h3>
                    {result.success && result.url && (
                      <div className="space-y-3">
                        <p className="text-sm text-green-800 break-all">
                          <strong>URL:</strong> {result.url}
                        </p>
                        <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden">
                          <Image
                            src={result.url}
                            alt="Uploaded image"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                    {result.error && (
                      <p className="text-sm text-red-800">{result.error}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Make sure your dev server is running (<code>pnpm dev</code>)</li>
            <li>Click "Select and Upload Image" and choose an image file</li>
            <li>Wait for the upload to complete</li>
            <li>If successful, you'll see the Cloudinary URL and preview</li>
            <li>If it fails, check the error message and verify your Cloudinary settings</li>
          </ol>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}
