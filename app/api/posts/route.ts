import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const images = await prisma.mainPost.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(images);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar imagens' }, { status: 500 });
    }
}