/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Inww5lGsLAb
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardContent } from "@/components/ui/card"
import { ImagensPost } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Posts = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
    ImagensPost: ImagensPost[];
}


function stripHtml(html: string) {
    // Cria um elemento DOM temporário para remover as tags HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
}

function getFirst150Chars(html: string) {
    // Primeiro, remove as tags HTML
    const textOnly = stripHtml(html);

    // Em seguida, extrai os primeiros 150 caracteres
    return textOnly.substring(0, 150);
}

export default function NewsCard(props: Posts) {
    const router = useRouter()
    return (
        <Card className="w-full max-w-md cursor-pointer" onClick={() => router.push(`news/${props.id}`)}>
            <Image
                src={props.ImagensPost[0].url}
                alt="News Image"
                width={600}
                height={400}
                className="w-full h-60 object-cover rounded-t-lg"
                style={{ aspectRatio: "600/400", objectFit: "cover" }}
            />
            <CardContent className="p-4">
                <h3 className="text-2xl font-bold mb-2">{props.title}</h3>
                <p>{getFirst150Chars(props.content) + '...'}</p>

            </CardContent>
        </Card>
    )
}