"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Users, Play, CheckCircle, Clock, Gift, Plus, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Sorteio {
  id: string
  nome: string
  descricao: string
  isPrincipal: boolean
  dataInicio: string
  dataFim: string | null
  ativo: boolean
  realizado: boolean
  vencedorId: string | null
  vencedor: {
    id: string
    nome: string
    cupomId: string
    contaCorrente: string
  } | null
  _count: {
    participacoes: number
  }
}

interface Participante {
  id: string
  nome: string
  cupomId: string
  contaCorrente: string
  classificacaoAleatoria: string
}

interface ParticipantesData {
  sorteio: Sorteio
  participantesElegiveis: Participante[]
  total: number
}

export function SorteiosManager() {
  const [sorteios, setSorteios] = useState<Sorteio[]>([])
  const [loading, setLoading] = useState(true)
  const [participantes, setParticipantes] = useState<ParticipantesData | null>(null)
  const [loadingParticipantes, setLoadingParticipantes] = useState(false)
  const [realizandoSorteio, setRealizandoSorteio] = useState(false)
  const [sorteioSelecionado, setSorteioSelecionado] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [creatingSorteio, setCreatingSorteio] = useState(false)
  const { toast } = useToast()

  // Form state para criar sorteio
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    isPrincipal: false,
    dataInicio: "",
    dataFim: "",
  })

  const fetchSorteios = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sorteios")
      const data = await response.json()
      setSorteios(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar sorteios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchParticipantes = async (sorteioId: string) => {
    try {
      setLoadingParticipantes(true)
      const response = await fetch(`/api/sorteios/${sorteioId}/participantes`)
      const data = await response.json()
      setParticipantes(data)
      setSorteioSelecionado(sorteioId)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar participantes",
        variant: "destructive",
      })
    } finally {
      setLoadingParticipantes(false)
    }
  }

  const realizarSorteio = async (sorteioId: string) => {
    try {
      setRealizandoSorteio(true)
      const response = await fetch(`/api/sorteios/${sorteioId}/realizar`, {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: `Sorteio realizado! Vencedor: ${data.vencedor.nome}`,
        })
        fetchSorteios()
        setParticipantes(null)
        setSorteioSelecionado(null)
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao realizar sorteio",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao realizar sorteio",
        variant: "destructive",
      })
    } finally {
      setRealizandoSorteio(false)
    }
  }

  const criarSorteio = async () => {
    try {
      setCreatingSorteio(true)
      const response = await fetch("/api/sorteios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Sorteio criado com sucesso",
        })
        setShowCreateDialog(false)
        setFormData({
          nome: "",
          descricao: "",
          isPrincipal: false,
          dataInicio: "",
          dataFim: "",
        })
        fetchSorteios()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao criar sorteio",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar sorteio",
        variant: "destructive",
      })
    } finally {
      setCreatingSorteio(false)
    }
  }

  useEffect(() => {
    fetchSorteios()
  }, []) // Removed fetchSorteios from the dependency array

  const getSorteioStatus = (sorteio: Sorteio) => {
    if (sorteio.realizado) {
      return { label: "Realizado", variant: "default" as const, icon: CheckCircle }
    }
    if (!sorteio.ativo) {
      return { label: "Inativo", variant: "secondary" as const, icon: Clock }
    }
    return { label: "Ativo", variant: "outline" as const, icon: Clock }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Sistema de Sorteios Flexível
              </CardTitle>
              <CardDescription>Crie e gerencie sorteios dinâmicos com regras personalizadas</CardDescription>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Sorteio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Sorteio</DialogTitle>
                  <DialogDescription>Configure um novo sorteio com regras personalizadas</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Sorteio</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: Sorteio de Natal 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição (opcional)</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      placeholder="Descreva o sorteio..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPrincipal"
                      checked={formData.isPrincipal}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPrincipal: checked })}
                    />
                    <Label htmlFor="isPrincipal" className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Sorteio Principal
                    </Label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData.isPrincipal
                      ? "Todos podem participar, mesmo quem já ganhou outros sorteios (com cupons diferentes)"
                      : "Apenas pessoas que nunca ganharam sorteios normais podem participar"}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataInicio">Data de Início</Label>
                      <Input
                        id="dataInicio"
                        type="datetime-local"
                        value={formData.dataInicio}
                        onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataFim">Data de Fim (opcional)</Label>
                      <Input
                        id="dataFim"
                        type="datetime-local"
                        value={formData.dataFim}
                        onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={criarSorteio} disabled={creatingSorteio || !formData.nome || !formData.dataInicio}>
                      {creatingSorteio ? "Criando..." : "Criar Sorteio"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando sorteios...</div>
          ) : sorteios.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum sorteio criado</h3>
              <p className="text-muted-foreground mb-4">Crie seu primeiro sorteio para começar</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Sorteio
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorteios.map((sorteio) => {
                const status = getSorteioStatus(sorteio)
                const StatusIcon = status.icon

                return (
                  <Card key={sorteio.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {sorteio.isPrincipal && <Star className="h-4 w-4 text-yellow-500" />}
                          {sorteio.nome}
                        </CardTitle>
                        <Badge variant={status.variant} className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <CardDescription>{sorteio.descricao || "Sem descrição"}</CardDescription>
                      {sorteio.isPrincipal && (
                        <Badge variant="secondary" className="w-fit">
                          <Star className="h-3 w-3 mr-1" />
                          Principal
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {sorteio.vencedor && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Vencedor</span>
                          </div>
                          <div className="text-sm text-green-700">
                            <div className="font-medium">{sorteio.vencedor.nome}</div>
                            <div className="text-xs">Cupom: {sorteio.vencedor.cupomId}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Participações:</span>
                        <span className="font-medium">{sorteio._count.participacoes}</span>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => fetchParticipantes(sorteio.id)}
                            >
                              <Users className="h-4 w-4 mr-1" />
                              Ver Elegíveis
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Participantes Elegíveis - {participantes?.sorteio.nome}</DialogTitle>
                              <DialogDescription>
                                Lista de todos os cupons elegíveis para participar deste sorteio
                              </DialogDescription>
                            </DialogHeader>
                            {loadingParticipantes ? (
                              <div className="text-center py-8">Carregando participantes...</div>
                            ) : participantes ? (
                              <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{participantes.total}</div>
                                    <div className="text-sm text-muted-foreground">Participantes Elegíveis</div>
                                  </div>
                                  {participantes.sorteio.isPrincipal && (
                                    <Badge variant="secondary">
                                      <Star className="h-3 w-3 mr-1" />
                                      Sorteio Principal
                                    </Badge>
                                  )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Cupom ID</TableHead>
                                        <TableHead>Conta Corrente</TableHead>
                                        <TableHead>Classificação</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {participantes.participantesElegiveis.map((participante) => (
                                        <TableRow key={participante.id}>
                                          <TableCell className="font-medium">{participante.nome}</TableCell>
                                          <TableCell>{participante.cupomId}</TableCell>
                                          <TableCell>{participante.contaCorrente}</TableCell>
                                          <TableCell>{participante.classificacaoAleatoria}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            ) : null}
                          </DialogContent>
                        </Dialog>

                        {!sorteio.realizado && sorteio.ativo && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" className="flex-1">
                                <Play className="h-4 w-4 mr-1" />
                                Realizar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Sorteio</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja realizar o sorteio {sorteio.nome}? Esta ação não pode ser
                                  desfeita e um vencedor será selecionado aleatoriamente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => realizarSorteio(sorteio.id)}
                                  disabled={realizandoSorteio}
                                >
                                  {realizandoSorteio ? "Realizando..." : "Confirmar Sorteio"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Regras do Sistema Flexível
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Sorteios Principais:
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Todos podem participar, mesmo vencedores anteriores</li>
                  <li>• Podem usar outros cupons (não os já sorteados)</li>
                  <li>• Ideal para grandes promoções e eventos especiais</li>
                  <li>• Reengaja participantes que já ganharam</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Sorteios Normais:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Apenas pessoas que nunca ganharam sorteios normais</li>
                  <li>• Cupons já sorteados não podem participar novamente</li>
                  <li>• Quem ganhou fica restrito a sorteios principais</li>
                  <li>• Garante oportunidades para novos participantes</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Controle por Conta:</h4>
              <p className="text-sm text-blue-700">
                O sistema controla a elegibilidade por conta corrente (pessoa), não por cupom individual. Uma pessoa
                pode ter vários cupons, mas se ganhou um sorteio normal, só pode usar outros cupons em sorteios
                principais.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
