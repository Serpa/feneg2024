import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCPF(cpf: string): string {
  // Remove caracteres não numéricos
  const cpfClean = cpf.replace(/[^\d]/g, "")

  // Formata o CPF: 000.000.000-00
  return cpfClean
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

export function formatPhone(phone: string): string {
  // Remove caracteres não numéricos
  const phoneClean = phone.replace(/[^\d]/g, "")

  // Formata o telefone: (00) 00000-0000
  return phoneClean.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
}
