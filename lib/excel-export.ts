import * as XLSX from "xlsx"
import { formatCPF } from "@/lib/utils"

export function exportToExcel(data: any[], fileName: string) {
  // Preparar os dados para exportação
  const exportData = data.map((item) => ({
    Nome: item.name,
    CPF: formatCPF(item.cpf),
    Contato: item.contact,
    Email: item.email || "-",
    "Aceitou Termos": item.acceptedTerms ? "Sim" : "Não",
    "Data de Aceitação": item.acceptedTermsAt ? new Date(item.acceptedTermsAt).toLocaleDateString("pt-BR") : "-",
    "Data de Registro": new Date(item.createdAt).toLocaleDateString("pt-BR"),
  }))

  // Criar uma nova planilha
  const worksheet = XLSX.utils.json_to_sheet(exportData)

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 30 }, // Nome
    { wch: 15 }, // CPF
    { wch: 15 }, // Contato
    { wch: 30 }, // Email
    { wch: 15 }, // Aceitou Termos
    { wch: 15 }, // Data de Aceitação
    { wch: 15 }, // Data de Registro
  ]
  worksheet["!cols"] = columnWidths

  // Criar um novo livro e adicionar a planilha
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Usuários")

  // Gerar o arquivo e fazer o download
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
