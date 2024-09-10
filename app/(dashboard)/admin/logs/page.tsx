'use client'
import React, { useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import useSWR from 'swr'
import Loading from '@/components/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingError from '@/components/error-loading'
import { useSession } from 'next-auth/react'

export default function Logs() {
    const session = useSession()
    if (![3, 4].includes(session.data?.user.id || 0)) return null

    const { data, error, isLoading, mutate } = useSWR('/api/admin/logs')
    if (error) return <LoadingError />
    if (isLoading) return <Loading />
    return (
        <div className='p-5'>
            <Card className='p-5'>
                <CardHeader>
                    <CardTitle>
                        Logs
                    </CardTitle>
                    <CardDescription>
                        Logs FENEG
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>
        </div>
    )
}