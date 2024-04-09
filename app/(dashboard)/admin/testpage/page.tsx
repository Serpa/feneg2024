'use client';
import LoadingError from '@/components/error-loading'
import Loading from '@/components/loading'
import { RichTextReadOnly } from 'mui-tiptap';
import React from 'react'
import useSWR from 'swr'
import useExtensions from '../sobre-nos/useExtensions';

export default function TestPage() {
    const extensions = useExtensions()
    const { data, isLoading, error } = useSWR('/api/admin/sobreNos')
    if (isLoading) return <Loading />
    if (error) return <LoadingError />
    return (
        <div className='h-full w-full'>
            {/* <div dangerouslySetInnerHTML={{ __html: data[0].pagina }} /> */}
            <RichTextReadOnly
                content={data[0].pagina}
                extensions={extensions}
            />
        </div>
    )
}
