import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { AdminDashboard } from "@/app/(dashboard)/admin/participantes/admin-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <AdminDataFetcher />
      </Suspense>
    </div>
  )
}

async function AdminDataFetcher() {
  const usuarios = await prisma.usuariosInteresados.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return <AdminDashboard initialData={usuarios} />
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[240px]" />
            <Skeleton className="h-9 w-[100px]" />
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-6 w-[100px]" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-8 w-[120px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
