"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { X, Plus } from "lucide-react"
import type { Product, DownloadableFile, ExternalLink, ProductSecret } from "@/lib/models/product"

interface ProductFormProps {
  product?: Product
  onSubmit: (productData: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: product?.title || "",
    category: product?.category || "",
    tags: product?.tags || [],
    shortDescription: product?.shortDescription || "",
    fullDescription: product?.fullDescription || "",
    coverImage: product?.coverImage || "",
    galleryImages: product?.galleryImages || [],
    downloadableFiles: product?.downloadableFiles || [],
    externalLinks: product?.externalLinks || [],
    secrets: product?.secrets || [],
    isPaid: product?.isPaid || false,
    version: product?.version || "1.0.0",
    changelog: product?.changelog || "",
  })

  const [newTag, setNewTag] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim()) {
      setError("Title is required")
      return
    }

    if (!formData.category.trim()) {
      setError("Category is required")
      return
    }

    if (!formData.shortDescription.trim()) {
      setError("Short description is required")
      return
    }

    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ""],
    }))
  }

  const updateGalleryImage = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.map((img, i) => (i === index ? value : img)),
    }))
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }))
  }

  const addDownloadableFile = () => {
    setFormData((prev) => ({
      ...prev,
      downloadableFiles: [...prev.downloadableFiles, { name: "", url: "", size: 0, type: "" }],
    }))
  }

  const updateDownloadableFile = (index: number, field: keyof DownloadableFile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      downloadableFiles: prev.downloadableFiles.map((file, i) => (i === index ? { ...file, [field]: value } : file)),
    }))
  }

  const removeDownloadableFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      downloadableFiles: prev.downloadableFiles.filter((_, i) => i !== index),
    }))
  }

  const addExternalLink = () => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: [...prev.externalLinks, { name: "", url: "", type: "other" }],
    }))
  }

  const updateExternalLink = (index: number, field: keyof ExternalLink, value: any) => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    }))
  }

  const removeExternalLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((_, i) => i !== index),
    }))
  }

  const addSecret = () => {
    setFormData((prev) => ({
      ...prev,
      secrets: [...prev.secrets, { name: "", value: "", description: "" }],
    }))
  }

  const updateSecret = (index: number, field: keyof ProductSecret, value: string) => {
    setFormData((prev) => ({
      ...prev,
      secrets: prev.secrets.map((secret, i) => (i === index ? { ...secret, [field]: value } : secret)),
    }))
  }

  const removeSecret = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      secrets: prev.secrets.filter((_, i) => i !== index),
    }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Create New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                disabled={isLoading}
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Full Description (Markdown)</Label>
              <Textarea
                id="fullDescription"
                value={formData.fullDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullDescription: e.target.value }))}
                disabled={isLoading}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} disabled={isLoading}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPaid"
                checked={formData.isPaid}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPaid: checked }))}
                disabled={isLoading}
              />
              <Label htmlFor="isPaid">Paid Product</Label>
            </div>
          </div>

          <Separator />

          {/* Version Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Version Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="changelog">Changelog</Label>
              <Textarea
                id="changelog"
                value={formData.changelog}
                onChange={(e) => setFormData((prev) => ({ ...prev, changelog: e.target.value }))}
                disabled={isLoading}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
