"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Cupom {
  id: string
  contaCorrente: string
  nome: string
  cupomId: string
  classificacaoAleatoria: string
  createdAt: string
  updatedAt: string
  foiSorteado?: boolean
}

interface CuponsResponse {
  cupons: Cupom[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function CuponsTable() {
  const [cupons, setCupons] = useState<Cupom[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [editingCupom, setEditingCupom] = useState<Cupom | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchCupons = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search,
      })

      const response = await fetch(`/api/cupons?${params}`)
      const data: CuponsResponse = await response.json()

      setCupons(data.cupons)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar cupons",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCupons()
  }, [page, search])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/cupons/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Cupom excluído com sucesso",
        })
        fetchCupons()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao excluir cupom",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir cupom",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (cupom: Cupom) => {
    setEditingCupom(cupom)
    setIsEditDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gerenciar Cupons</CardTitle>
            <CardDescription>Lista de todos os cupons cadastrados no sistema</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cupom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CupomForm
                onSuccess={() => {
                  setIsAddDialogOpen(false)
                  fetchCupons()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, cupom ID, conta corrente..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conta Corrente</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Cupom ID</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : cupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum cupom encontrado
                  </TableCell>
                </TableRow>
              ) : (
                cupons.map((cupom) => (
                  <TableRow key={cupom.id}>
                    <TableCell className="font-medium">{cupom.contaCorrente}</TableCell>
                    <TableCell>{cupom.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {cupom.cupomId}
                        {cupom.foiSorteado && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Sorteado
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{cupom.classificacaoAleatoria}</TableCell>
                    <TableCell>{new Date(cupom.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(cupom)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={cupom.foiSorteado}
                              title={cupom.foiSorteado ? "Não é possível excluir cupons já sorteados" : "Excluir cupom"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cupom {cupom.cupomId}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(cupom.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {cupons.length} de {pagination.total} cupons
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {page} de {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            {editingCupom && (
              <CupomForm
                cupom={editingCupom}
                onSuccess={() => {
                  setIsEditDialogOpen(false)
                  setEditingCupom(null)
                  fetchCupons()
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

interface CupomFormProps {
  cupom?: Cupom
  onSuccess: () => void
}

function CupomForm({ cupom, onSuccess }: CupomFormProps) {
  const [formData, setFormData] = useState({
    contaCorrente: cupom?.contaCorrente || "",
    nome: cupom?.nome || "",
    cupomId: cupom?.cupomId || "",
    classificacaoAleatoria: cupom?.classificacaoAleatoria || "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = cupom ? `/api/cupons/${cupom.id}` : "/api/cupons"
      const method = cupom ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: cupom ? "Cupom atualizado com sucesso" : "Cupom criado com sucesso",
        })
        onSuccess()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao salvar cupom",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar cupom",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{cupom ? "Editar Cupom" : "Adicionar Cupom"}</DialogTitle>
        <DialogDescription>
          {cupom ? "Edite as informações do cupom" : "Preencha as informações do novo cupom"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contaCorrente">Conta Corrente</Label>
          <Input
            id="contaCorrente"
            value={formData.contaCorrente}
            onChange={(e) => setFormData({ ...formData, contaCorrente: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cupomId">Cupom ID</Label>
          <Input
            id="cupomId"
            value={formData.cupomId}
            onChange={(e) => setFormData({ ...formData, cupomId: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="classificacaoAleatoria">Classificação Aleatória</Label>
          <Input
            id="classificacaoAleatoria"
            value={formData.classificacaoAleatoria}
            onChange={(e) => setFormData({ ...formData, classificacaoAleatoria: e.target.value })}
            required
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : cupom ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
