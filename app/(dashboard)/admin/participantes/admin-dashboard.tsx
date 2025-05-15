"use client"

import { useState } from "react"
import { DataTable } from "@/app/(dashboard)/admin/participantes/data-table"
import { columns } from "@/app/(dashboard)/admin/participantes/columns"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download, RefreshCw, Search } from "lucide-react"
import { exportToExcel } from "@/lib/excel-export"
import { useToast } from "@/components/ui/use-toast"

interface AdminDashboardProps {
  initialData: any[]
}

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [data, setData] = useState(initialData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredData = data.filter((item) => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(query) ||
      item.cpf.includes(query) ||
      item.contact.includes(query) ||
      (item.email && item.email.toLowerCase().includes(query))
    )
  })

  const refreshData = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch("/api/admin/registrations")
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        toast({
          title: "Dados atualizados",
          description: "A lista de usuários foi atualizada com sucesso.",
        })
      } else {
        throw new Error(result.error || "Erro ao atualizar dados")
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleExport = () => {
    try {
      exportToExcel(filteredData, "usuarios-interessados")
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/registrations/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao excluir usuário")
      }

      // Atualizar o estado local removendo o usuário excluído
      setData((prev) => prev.filter((user) => user.id !== userId))

      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível excluir o usuário. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async (userId: string, updatedData: any) => {
    try {
      const response = await fetch(`/api/admin/registrations/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao atualizar usuário")
      }

      const result = await response.json()

      // Atualizar o estado local com os dados atualizados
      setData((prev) => prev.map((user) => (user.id === userId ? result.data : user)))

      toast({
        title: "Usuário atualizado",
        description: "Os dados do usuário foram atualizados com sucesso.",
      })

      return true
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o usuário. Tente novamente.",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuários..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredData.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Exportar XLSX
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={filteredData} onDelete={handleDeleteUser} onUpdate={handleUpdateUser} />
    </Card>
  )
}
