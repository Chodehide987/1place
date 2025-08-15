"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, FileText, Lock, Eye, EyeOff } from "lucide-react"
import type { Product } from "@/lib/models/product"

interface SecureFileListProps {
  product: Product
  hasAccess: boolean
  isAuthenticated: boolean
}

export function SecureFileList({ product, hasAccess, isAuthenticated }: SecureFileListProps) {
  const [downloadingFiles, setDownloadingFiles] = useState<Set<number>>(new Set())
  const [visibleSecrets, setVisibleSecrets] = useState<Set<number>>(new Set())

  const handleDownload = async (fileIndex: number) => {
    if (!hasAccess || !isAuthenticated) return

    setDownloadingFiles((prev) => new Set(prev).add(fileIndex))

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/files/download/${product._id}/${fileIndex}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Create download link
        const link = document.createElement("a")
        link.href = data.downloadUrl
        link.download = data.file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        const error = await response.json()
        alert(error.error || "Download failed")
      }
    } catch (error) {
      console.error("Download error:", error)
      alert("Download failed")
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(fileIndex)
        return newSet
      })
    }
  }

  const toggleSecretVisibility = (index: number) => {
    setVisibleSecrets((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Downloadable Files */}
      {(product.downloadableFiles?.length || 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Downloadable Files
              {!hasAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!hasAccess && (
              <Alert className="mb-4">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  {!isAuthenticated
                    ? "Please sign in to access downloadable files."
                    : "This is a paid product. Contact admin for access."}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {(product.downloadableFiles || []).map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.type} • {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDownload(index)}
                    disabled={!hasAccess || !isAuthenticated || downloadingFiles.has(index)}
                    size="sm"
                  >
                    {downloadingFiles.has(index) ? (
                      "Downloading..."
                    ) : hasAccess ? (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* External Links */}
      {(product.externalLinks?.length || 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              External Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(product.externalLinks || []).map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{link.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {link.type}
                      </Badge>
                    </div>
                  </div>

                  <Button asChild size="sm" variant="outline">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      Open Link
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Secrets */}
      {(product.secrets?.length || 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Secrets & Passwords
              {!hasAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!hasAccess && (
              <Alert className="mb-4">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  {!isAuthenticated
                    ? "Please sign in to access secrets and passwords."
                    : "This is a paid product. Contact admin for access."}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {(product.secrets || []).map((secret, index) => (
                <div key={index} className="p-3 border rounded-lg bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{secret.name}</p>
                    {hasAccess && (
                      <Button variant="ghost" size="sm" onClick={() => toggleSecretVisibility(index)}>
                        {visibleSecrets.has(index) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>

                  {secret.description && <p className="text-sm text-muted-foreground mb-2">{secret.description}</p>}

                  <div className="font-mono text-sm p-2 bg-muted rounded">
                    {hasAccess ? (
                      visibleSecrets.has(index) ? (
                        secret.value
                      ) : (
                        "••••••••••••••••"
                      )
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        Access required to view secret
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
