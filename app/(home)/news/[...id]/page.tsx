import React from 'react'
import dayjs from 'dayjs';
import prisma from "@/lib/prisma";
import NewsCarousel from './news-carousel';

function RenderHtml({ content }: { content: string }) {
    return (
        <div
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

export default async function PostId({ params }: { params: { id: string | string[] } }) {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const data = await prisma.posts.findUnique({
        where: { id: +id },
        include: { ImagensPost: true }
    });

    if (!data) return <div className="text-center p-10 font-bold text-2xl">Notícia não encontrada.</div>;

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-5xl">
                <NewsCarousel images={data.ImagensPost} />
                <div className="bg-background p-8 md:p-12 rounded-b-lg">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            {data.title}
                        </h1>
                        <div className="flex items-center space-x-4 text-muted-foreground">
                            <span>{dayjs(data.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                        </div>
                    </div>
                    <div className="prose prose-lg max-w-none mt-8">
                        <RenderHtml content={data.content} />
                    </div>
                </div>
            </div>
        </div>
    )
}
