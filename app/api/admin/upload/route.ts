import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const dataUpload = await req.json()
        const responseList = await Promise.all(dataUpload.images.map((async (img: string) => {
            const uploadResponse = await cloudinary.uploader.upload(img, {
                upload_preset: 'ml_default',
                folder: dataUpload.folder
            });
            return uploadResponse
        })))

        return new Response(JSON.stringify(responseList), { status: 200 })
    } catch (error) {
        console.log(error);

        return new Response(JSON.stringify(error), { status: 500 })
    }
}