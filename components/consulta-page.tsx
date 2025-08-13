"use client"

import type React from "react"
import { useState } from "react"
import { Search, Trophy, Ticket, User, Shield, Award, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CupomData {
  cupomId: string
  nome: string
  classificacaoAleatoria: string
  createdAt: string
  sorteioVencedor?: {
    nome: string
    dataInicio: string
  }
}

interface ConsultaResponse {
  contaCorrente: string
  nome: string
  totalCupons: number
  cuponsDisponiveis: number
  cuponsVencedores: number
  cupons: {
    disponiveis: CupomData[]
    vencedores: CupomData[]
  }
}

export default function ConsultaPage() {
  const [contaCorrente, setContaCorrente] = useState("")
  const [dados, setDados] = useState<ConsultaResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const buscarCupons = async () => {
    if (!contaCorrente.trim()) {
      setError("Digite o número da conta corrente")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/consulta?conta=${encodeURIComponent(contaCorrente)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar cupons")
      }

      setDados(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar cupons")
      setDados(null)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      buscarCupons()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 font-sans">Campanha Aplique e Ganhe</h1>
            {/* <p className="text-xl text-slate-600 font-serif leading-relaxed">
              Plataforma oficial para consulta de cupons promocionais.
            </p> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* How it Works Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-slate-900 font-sans">Como Funciona Nosso Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">1. Consulte Seus Cupons</h3>
                  <p className="text-sm text-slate-600 font-serif">
                    Digite seu número de conta corrente para visualizar todos os seus cupons ativos
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-cyan-100 rounded-full w-fit mx-auto mb-4">
                    <Ticket className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">2. Acompanhe Status</h3>
                  <p className="text-sm text-slate-600 font-serif">
                    Veja quais cupons estão disponíveis para sorteios e seu histórico de participações
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">3. Participe dos Sorteios</h3>
                  <p className="text-sm text-slate-600 font-serif">
                    Seus cupons participam automaticamente dos sorteios conforme as regras estabelecidas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold text-slate-900 font-sans">Consultar Meus Cupons</CardTitle>
              <p className="text-slate-600 font-serif">
                Informe o número da sua conta corrente para acessar seus cupons
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Digite o número da conta corrente..."
                  value={contaCorrente}
                  onChange={(e) => setContaCorrente(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 pr-4 py-3 text-lg rounded-lg border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
              <Button
                onClick={buscarCupons}
                disabled={loading}
                className="w-full py-3 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Consultando...
                  </div>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Consultar Cupons
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-700 text-center font-serif">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {dados && (
          <div className="max-w-6xl mx-auto">
            {/* User Info */}
            <Card className="mb-8 shadow-lg border-0 bg-white">
              <CardHeader className="bg-slate-50 rounded-t-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 font-sans">
                      {dados.nome || "Titular da Conta"}
                    </CardTitle>
                    <p className="text-slate-600 font-serif">Conta Corrente: {dados.contaCorrente}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{dados.totalCupons}</div>
                    <div className="text-sm font-medium text-slate-700">Total de Cupons</div>
                    <div className="text-xs text-slate-500 mt-1">Cupons registrados</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-3xl font-bold text-green-600 mb-2">{dados.cuponsDisponiveis}</div>
                    <div className="text-sm font-medium text-slate-700">Disponíveis</div>
                    <div className="text-xs text-slate-500 mt-1">Para próximos sorteios</div>
                  </div>
                  <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="text-3xl font-bold text-amber-600 mb-2">{dados.cuponsVencedores}</div>
                    <div className="text-sm font-medium text-slate-700">Premiados</div>
                    <div className="text-xs text-slate-500 mt-1">Cupons vencedores</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Status */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Ticket className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 font-sans">Status dos Cupons</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-semibold text-slate-900">Cupons Ativos</div>
                          <div className="text-sm text-slate-600 font-serif">Elegíveis para próximos sorteios</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{dados.cuponsDisponiveis}</div>
                    </div>

                    {dados.cuponsVencedores > 0 && (
                      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-center gap-3">
                          <Trophy className="h-5 w-5 text-amber-600" />
                          <div>
                            <div className="font-semibold text-slate-900">Cupons Premiados</div>
                            <div className="text-sm text-slate-600 font-serif">Já foram sorteados anteriormente</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-amber-600">{dados.cuponsVencedores}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Participation Status */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 font-sans">
                      Histórico de Participação
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dados.cuponsVencedores > 0 ? (
                      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Trophy className="h-5 w-5 text-amber-600" />
                          <div className="font-semibold text-slate-900">Parabéns! Você já foi premiado!</div>
                        </div>
                        <div className="text-sm text-slate-600 font-serif">
                          Você possui {dados.cuponsVencedores} cupom{dados.cuponsVencedores > 1 ? "s" : ""} premiado
                          {dados.cuponsVencedores > 1 ? "s" : ""} em sorteios anteriores.
                        </div>
                        {dados.cuponsDisponiveis > 0 && (
                          <div className="text-sm text-green-700 mt-2 font-medium">
                            Você ainda pode participar de sorteios principais com seus {dados.cuponsDisponiveis} cupons
                            ativos.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Ticket className="h-5 w-5 text-blue-600" />
                          <div className="font-semibold text-slate-900">Pronto para participar!</div>
                        </div>
                        <div className="text-sm text-slate-600 font-serif">
                          Você ainda não foi sorteado. Seus cupons estão elegíveis para todos os tipos de sorteios.
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Information Footer */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 font-sans">Informações Importantes</h3>
                  <div className="text-sm text-slate-600 font-serif space-y-1">
                    <p>• Cupons ativos podem participar de sorteios normais e principais</p>
                    <p>• Após ser premiado em sorteio normal, você só pode participar de sorteios principais</p>
                    <p>• Sorteios principais permitem participação de todos os cupons ativos</p>
                    <p>• Consulte regularmente para acompanhar novos sorteios e oportunidades</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
