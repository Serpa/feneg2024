'use client';
import Login from '@/components/admin/login'
import { useSession } from 'next-auth/react';


export default function Dashboard() {
  const session = useSession();
  return (
    <div className="flex grow flex-col justify-center align-middle items-center h-full">
      {session.status === 'authenticated' ? (<pre>{session?.data?.user?.email}</pre>) : <Login />}
    </div>
  )
}