"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react"

interface UploadResult {
  success: boolean
  message: string
  stats: {
    totalLinhas: number
    inseridos: number
    erros: number
    duplicatas: number
  }
  errors: string[]
  duplicates: string[]
}

export function UploadXlsx() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/cupons/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        setFile(null)
        // Reset input
        const input = document.getElementById("file-upload") as HTMLInputElement
        if (input) input.value = ""
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Erro ao fazer upload do arquivo",
        stats: { totalLinhas: 0, inseridos: 0, erros: 1, duplicatas: 0 },
        errors: ["Erro de conexão"],
        duplicates: [],
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload de Cupons via XLSX
        </CardTitle>
        <CardDescription>
          Faça upload de um arquivo Excel com a estrutura: Conta Corrente, Nome, CupomID, Classificação Aleatória
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Selecionar arquivo Excel</Label>
          <Input id="file-upload" type="file" accept=".xlsx,.xls" onChange={handleFileChange} disabled={uploading} />
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <Button onClick={handleUpload} disabled={uploading} size="sm">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Fazer Upload
                </>
              )}
            </Button>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <Progress value={undefined} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">Processando arquivo...</p>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.message}
                </AlertDescription>
              </div>
            </Alert>

            {result.success && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{result.stats.totalLinhas}</div>
                  <div className="text-xs text-muted-foreground">Total de linhas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.stats.inseridos}</div>
                  <div className="text-xs text-muted-foreground">Inseridos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{result.stats.duplicatas}</div>
                  <div className="text-xs text-muted-foreground">Duplicatas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{result.stats.erros}</div>
                  <div className="text-xs text-muted-foreground">Erros</div>
                </div>
              </div>
            )}

            {(result.errors.length > 0 || result.duplicates.length > 0) && (
              <div className="space-y-2">
                {result.errors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-1">Erros encontrados:</h4>
                    <div className="text-xs text-red-600 space-y-1 max-h-32 overflow-y-auto">
                      {result.errors.map((error, index) => (
                        <div key={index} className="p-2 bg-red-50 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.duplicates.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-yellow-600 mb-1">Duplicatas ignoradas:</h4>
                    <div className="text-xs text-yellow-600 space-y-1 max-h-32 overflow-y-auto">
                      {result.duplicates.map((duplicate, index) => (
                        <div key={index} className="p-2 bg-yellow-50 rounded">
                          {duplicate}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
