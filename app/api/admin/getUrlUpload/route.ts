import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import * as Minio from 'minio'

const s3Client = new Minio.Client({
    endPoint: process.env.END_POINT_MINIO as string,
    accessKey: process.env.ACCESS_KEY_MINIO as string,
    secretKey: process.env.SECRET_KEY_MINIO as string,
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const { bucketName, fileName } = await req.json()
        const expiry = 60 * 1000;
        const presignedUrl = await s3Client.presignedPutObject(
            bucketName,
            fileName,
            expiry,
        );

        return new Response(JSON.stringify(presignedUrl), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), { status: 500 })
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const bucketName = searchParams.get("bucketName");
    const fileName = searchParams.get("fileName");

    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        if (!bucketName || !fileName) return new Response(JSON.stringify('Erro: BAD REQUEST'), { status: 400 })

        const fileUrl = await s3Client.presignedGetObject(
            bucketName,
            fileName,
        );

        return new Response(JSON.stringify(fileUrl), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), { status: 500 })
    }
}