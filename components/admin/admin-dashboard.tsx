"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { UploadXlsx } from "@/components/admin/upload-xlsx"
import { CuponsTable } from "@/components/admin/cupons-table"
import { SorteiosManager } from "@/components/admin/sorteios-manager"
import {
  BarChart3,
  FileSpreadsheet,
  Gift,
  Trophy,
  Users,
  Upload,
  Settings,
  TrendingUp,
  Calendar,
  CheckCircle,
  Star,
} from "lucide-react"

interface DashboardStats {
  totalCupons: number
  totalSorteios: number
  sorteiosRealizados: number
  sorteiosPendentes: number
  sorteiosPrincipais: number
  ultimoUpload: string | null
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCupons: 0,
    totalSorteios: 0,
    sorteiosRealizados: 0,
    sorteiosPendentes: 0,
    sorteiosPrincipais: 0,
    ultimoUpload: null,
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)

      // Buscar estatísticas de cupons
      const cuponsResponse = await fetch("/api/cupons?limit=1")
      const cuponsData = await cuponsResponse.json()

      // Buscar estatísticas de sorteios
      const sorteiosResponse = await fetch("/api/sorteios")
      const sorteiosData = await sorteiosResponse.json()

      const sorteiosRealizados = sorteiosData.filter((s: any) => s.realizado).length
      const sorteiosPendentes = sorteiosData.filter((s: any) => !s.realizado && s.ativo).length
      const sorteiosPrincipais = sorteiosData.filter((s: any) => s.isPrincipal).length

      setStats({
        totalCupons: cuponsData.pagination?.total || 0,
        totalSorteios: sorteiosData.length || 0,
        sorteiosRealizados,
        sorteiosPendentes,
        sorteiosPrincipais,
        ultimoUpload: null, // Pode ser implementado posteriormente
      })
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const refreshStats = () => {
    fetchStats()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sistema de Gerenciamento de Cupons</h1>
              <p className="text-muted-foreground mt-1">Painel administrativo com sorteios flexíveis e dinâmicos</p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              <Settings className="h-4 w-4 mr-1" />
              Admin
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Cupons</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalCupons.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Cupons cadastrados no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sorteios Realizados</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.sorteiosRealizados}</div>
              <p className="text-xs text-muted-foreground">de {stats.totalSorteios} sorteios totais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sorteios Ativos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.sorteiosPendentes}</div>
              <p className="text-xs text-muted-foreground">Aguardando realização</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sorteios Principais</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.sorteiosPrincipais}</div>
              <p className="text-xs text-muted-foreground">Todos podem participar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading
                  ? "..."
                  : stats.totalSorteios > 0
                    ? `${Math.round((stats.sorteiosRealizados / stats.totalSorteios) * 100)}%`
                    : "0%"}
              </div>
              <p className="text-xs text-muted-foreground">Sorteios concluídos</p>
            </CardContent>
          </Card>
        </div>

        {/* Navegação Principal */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload XLSX
            </TabsTrigger>
            <TabsTrigger value="cupons" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Gerenciar Cupons
            </TabsTrigger>
            <TabsTrigger value="sorteios" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Sorteios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Status do Sistema
                  </CardTitle>
                  <CardDescription>Resumo das operações do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cupons Cadastrados</span>
                    <Badge variant="secondary">{stats.totalCupons}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sorteios Criados</span>
                    <Badge variant="secondary">{stats.totalSorteios}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sorteios Realizados</span>
                    <Badge variant={stats.sorteiosRealizados > 0 ? "default" : "secondary"}>
                      {stats.sorteiosRealizados}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sorteios Ativos</span>
                    <Badge variant={stats.sorteiosPendentes > 0 ? "outline" : "secondary"}>
                      {stats.sorteiosPendentes}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Sorteios Principais
                    </span>
                    <Badge variant={stats.sorteiosPrincipais > 0 ? "default" : "secondary"}>
                      {stats.sorteiosPrincipais}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Ações Rápidas
                  </CardTitle>
                  <CardDescription>Operações mais utilizadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Upload className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Upload de Cupons</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Via arquivo XLSX</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Gerenciar Cupons</span>
                      </div>
                      <span className="text-xs text-muted-foreground">CRUD completo</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Gift className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Criar Sorteios</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Sistema flexível</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Realizar Sorteios</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Automatizado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sistema Flexível de Sorteios</CardTitle>
                <CardDescription>Como utilizar o novo sistema dinâmico de gerenciamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">1. Upload de Cupons</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Prepare um arquivo Excel (.xlsx) com as colunas:</li>
                      <li className="ml-4">- Conta Corrente</li>
                      <li className="ml-4">- Nome</li>
                      <li className="ml-4">- CupomID (suporta UUIDs)</li>
                      <li className="ml-4">- Classificação Aleatória</li>
                      <li>• Use a aba Upload XLSX para importar</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">2. Gerenciamento</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Visualize todos os cupons na aba Gerenciar Cupons</li>
                      <li>• Adicione cupons individuais sem arquivo</li>
                      <li>• Edite ou exclua cupons existentes</li>
                      <li>• Use a busca para encontrar cupons específicos</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      3. Sorteios Principais
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Todos podem participar, mesmo vencedores anteriores</li>
                      <li>• Ideal para grandes promoções e eventos especiais</li>
                      <li>• Reengaja participantes que já ganharam</li>
                      <li>• Cupons já sorteados não podem ser reutilizados</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">4. Sorteios Normais</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Apenas pessoas que nunca ganharam sorteios normais</li>
                      <li>• Garante oportunidades para novos participantes</li>
                      <li>• Quem ganhou fica restrito a sorteios principais</li>
                      <li>• Controle por conta corrente (pessoa)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <div className="flex justify-center">
              <UploadXlsx />
            </div>
          </TabsContent>

          <TabsContent value="cupons">
            <CuponsTable />
          </TabsContent>

          <TabsContent value="sorteios">
            <SorteiosManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
