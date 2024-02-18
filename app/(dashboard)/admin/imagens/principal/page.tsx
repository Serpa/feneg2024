'use client'
import React from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import useSWR from 'swr'
import Loading from '@/components/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingError from '@/components/error-loading'

export default function ImagensPrincipal() {
    const { data, error, isLoading } = useSWR('/api/admin/mainPosts')
    if (error) return <LoadingError/>
    if (isLoading) return <Loading />
    return (
        <div className='p-5'>
            <Card className='p-5'>
                <CardHeader>
                    <CardTitle>
                        Cadastro de Interessados.
                    </CardTitle>
                    <CardDescription>
                        Lista de usuários que realizaram o cadastro para exposição na FENEG 2024.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>
        </div>
    )
}
