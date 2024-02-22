import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';

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
        const formData = await req.formData()
        const images = formData.getAll('images') as unknown as File[];
        const folder = formData.get('folder')?.toString();

        const responseList = await Promise.all(
            images.map(async (img) => {
                const fileBuffer = await img.arrayBuffer();

                var mime = img.type;
                var encoding = 'base64';
                var base64Data = Buffer.from(fileBuffer).toString('base64');
                var fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

                const uploadResponse = await cloudinary.uploader.upload(fileUri, {
                    upload_preset: 'ml_default',
                    folder: folder
                });
                return uploadResponse
            })
        )

        return new Response(JSON.stringify(responseList), { status: 200 })
    } catch (error) {
        console.log(error);

        return new Response(JSON.stringify(error), { status: 500 })
    }
}
