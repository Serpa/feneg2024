"use client"

import { useSession } from "next-auth/react"
import Login from "@/components/admin/login"
import Loading from "@/components/loading"
import LoadingError from "@/components/error-loading"
import useSWR from "swr"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export default function SmallImagesPage() {
  const session = useSession()
  const { data, error, isLoading } = useSWR("/api/admin/smallImages")

  if (session.status === "unauthenticated") {
    return (
      <div className="flex grow flex-col justify-center align-middle items-center h-full">
        <Login />
      </div>
    )
  } else if (session.status === "authenticated") {
    if (error) return <LoadingError />
    if (isLoading) return <Loading />

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Imagens 180x180</h1>
        <DataTable columns={columns} data={data} />
      </div>
    )
  }
}
