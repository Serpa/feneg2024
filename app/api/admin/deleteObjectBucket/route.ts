import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import * as Minio from 'minio'
import { logAction } from '@/lib/log';

const s3Client = new Minio.Client({
    endPoint: process.env.END_POINT_MINIO as string,
    accessKey: process.env.ACCESS_KEY_MINIO as string,
    secretKey: process.env.SECRET_KEY_MINIO as string,
})

// export async function POST(req: Request) {
//     const session = await getServerSession(authOptions)
//     if (!session) {
//         return new Response('Não autorizado!', { status: 401 })
//     }
//     try {
//         const urls = [];
//         const { bucketName, fileNames } = await req.json()
//         console.log(fileNames)
//         for (const fileName of fileNames) {
//             const expiry = 60 * 1000;
//             const presignedUrl = await s3Client.presignedPutObject(
//                 bucketName,
//                 fileName,
//                 expiry,
//             );
//             // Gere a URL pré-assinada para cada arquivo
//             urls.push(presignedUrl);
//         }

//         return new Response(JSON.stringify(urls), { status: 200 })
//     } catch (error) {
//         console.log(error);
//         return new Response(JSON.stringify(error), { status: 500 })
//     }
// }

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

        const fileUrl = await s3Client.removeObject(
            bucketName,
            fileName,
        );

        const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'IP não disponível';
        await logAction(session.user.id, "REMOVE_BUCKET", {
            bucketName,
            fileName,
        }, ip);

        return new Response(JSON.stringify(fileUrl), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), { status: 500 })
    }
}