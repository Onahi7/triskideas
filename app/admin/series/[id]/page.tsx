"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2, Plus, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getSeriesById,
  getEpisodesBySeriesId,
  deleteEpisode,
  type Series,
  type Episode,
} from "@/lib/db-actions"
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

export default function SeriesEpisodesPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [series, setSeries] = useState<Series | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [episodeToDelete, setEpisodeToDelete] = useState<number | null>(null)

  const seriesId = parseInt(params.id as string)

  useEffect(() => {
    loadData()
  }, [seriesId])

  const loadData = async () => {
    try {
      const [seriesData, episodesData] = await Promise.all([
        getSeriesById(seriesId),
        getEpisodesBySeriesId(seriesId),
      ])
      setSeries(seriesData)
      setEpisodes(episodesData)
    } catch (error) {
      toast({ title: "Error", description: "Failed to load series data", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: number) => {
    setEpisodeToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (episodeToDelete) {
      try {
        await deleteEpisode(episodeToDelete)
        toast({ title: "Success", description: "Episode deleted!" })
        loadData()
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete episode", variant: "destructive" })
      }
      setEpisodeToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  if (!series) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Series not found</p>
          <Link href="/admin/series">
            <Button variant="outline">Back to Series</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/series">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900">{series.name}</h1>
          <p className="text-gray-600 mt-1">{series.description || "Manage episodes for this series"}</p>
        </div>
        <Link href={`/admin/series/${seriesId}/episode/new`}>
          <Button className="bg-amber-700 hover:bg-amber-800 text-white gap-2">
            <Plus size={20} />
            New Episode
          </Button>
        </Link>
      </div>

      {episodes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 py-8">No episodes yet. Create one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {episodes.map((episode) => (
            <Card key={episode.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-amber-700 border-amber-700">
                        Episode {episode.episodeNumber}
                      </Badge>
                      <h3 className="text-lg font-bold text-gray-900">{episode.title}</h3>
                      {episode.published ? (
                        <Eye size={16} className="text-green-600" />
                      ) : (
                        <EyeOff size={16} className="text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">slug: {episode.slug}</p>
                    {episode.excerpt && <p className="text-gray-600 text-sm">{episode.excerpt}</p>}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>Views: {episode.viewCount || 0}</span>
                      {episode.publishedAt && (
                        <span>Published: {new Date(episode.publishedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/series/${seriesId}/episode/${episode.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit2 size={16} />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(episode.id)} className="gap-2">
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
            <AlertDialogTitle>Delete Episode</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this episode? This action cannot be undone.
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
