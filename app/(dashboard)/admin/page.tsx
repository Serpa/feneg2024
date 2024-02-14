'use client';
import Login from '@/components/admin/login'
import LoadingError from '@/components/error-loading';
import Loading from '@/components/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';


export default function Dashboard() {
  const session = useSession();
  const { data, error, isLoading } = useSWR('/api/admin/registers')
  if (session.status === 'unauthenticated') {
    return (
      <div className="flex grow flex-col justify-center align-middle items-center h-full">
        <Login />
      </div>
    )
  } else if (session.status === 'authenticated') {
    if (error) return <LoadingError />
    if (isLoading) return <Loading />
    return (
      <div className="flex grow flex-col h-full justify-between">
        <Card className='w-fit m-5'>
          <CardHeader>
            <CardTitle>
              Número de Registros.
            </CardTitle>
            <CardContent className='flex items-center justify-center align-middle h-full'>
              <p className='flex text-5xl shadow-lg font-semibold justify-center'>{data.length}</p>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    )
  }

}
