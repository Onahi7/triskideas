"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit2, Plus, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAllSeries, deleteSeries, type Series } from "@/lib/db-actions"
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

export default function ManageSeriesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [series, setSeries] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [seriesToDelete, setSeriesToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadSeries()
  }, [])

  const loadSeries = async () => {
    try {
      const data = await getAllSeries()
      setSeries(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to load series", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: number) => {
    setSeriesToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (seriesToDelete) {
      try {
        await deleteSeries(seriesToDelete)
        toast({ title: "Success", description: "Series deleted!" })
        loadSeries()
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete series", variant: "destructive" })
      }
      setSeriesToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Manage Series</h1>
          <p className="text-gray-600 mt-1">Create episodic blog content (e.g., Chapter 1, Chapter 2, etc.)</p>
        </div>
        <Link href="/admin/series/new">
          <Button className="bg-amber-700 hover:bg-amber-800 text-white gap-2">
            <Plus size={20} />
            New Series
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : series.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 py-8">No series yet. Create one to organize episodic content!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {series.map((s) => (
            <Card key={s.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={20} className="text-amber-700" />
                      <h3 className="text-lg font-bold text-gray-900">{s.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">slug: {s.slug}</p>
                    {s.description && <p className="text-gray-600">{s.description}</p>}
                    <p className="text-sm text-amber-700 mt-2">{s.episodeCount || 0} episodes</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/series/${s.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Edit2 size={16} />
                        Manage Episodes
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)} className="gap-2">
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
            <AlertDialogTitle>Delete Series</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this series and all its episodes? This action cannot be undone.
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
