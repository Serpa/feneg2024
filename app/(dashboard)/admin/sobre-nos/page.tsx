'use client';
import {
    LinkBubbleMenu,
    RichTextEditor,
    TableBubbleMenu,
    type RichTextEditorRef,
} from "mui-tiptap";
import { useRef, useState } from "react";
import useExtensions from "./useExtensions";
import EditorMenuControls from "./MenuControls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import Loading from "@/components/loading";
import LoadingError from "@/components/error-loading";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SobreNosEdit() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const extensions = useExtensions();
    const rteRef = useRef<RichTextEditorRef>(null);
    const { data, isLoading, error, mutate } = useSWR('/api/admin/sobreNos')
    if (isLoading) return <Loading />
    if (error) return <LoadingError />

    async function handleUpdate() {
        setLoading(true)
        try {
            const res = await axios.put('/api/admin/sobreNos', { pagina: rteRef.current?.editor?.getHTML() })
            toast({
                title: "Sucesso!",
                description: "A página foi alterada com sucesso!",
            })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast({
                title: "Erro!",
                description: "A página não foi alterada!",
                variant: 'destructive'
            })
        }
    }
    async function handleCheck() {
        setLoading(true)
        try {
            const res = await axios.put('/api/admin/sobreNos', { ativo: !data[0].ativo })
            toast({
                title: "Sucesso!",
                description: "O Satatus da página foi alterada com sucesso!",
            })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast({
                title: "Erro!",
                description: "O Status da página não foi alterada!",
                variant: 'destructive'
            })
        }
    }
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Sobre nós.
                    </CardTitle>
                    <CardDescription>
                        Altere o conteudo da página sobre nós.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 m-5">
                        <Switch disabled={loading} checked={data[0].ativo} onCheckedChange={handleCheck} />
                        <Label htmlFor="airplane-mode">Página {data[0].ativo ? 'Ativa' : 'Desativada'}</Label>
                    </div>
                    <RichTextEditor
                        ref={rteRef}
                        extensions={extensions}
                        content={data[0].pagina}
                        renderControls={() => <EditorMenuControls />}
                    >
                        {() => (
                            <>
                                <LinkBubbleMenu
                                    labels={{
                                        editLinkSaveButtonLabel: 'Salvar',
                                        editLinkTextInputLabel: 'Texto',
                                        editLinkCancelButtonLabel: 'Cancelar',
                                        viewLinkEditButtonLabel: 'Editar',
                                        viewLinkRemoveButtonLabel: 'Remover'
                                    }}
                                />
                                <TableBubbleMenu />
                            </>
                        )}
                    </RichTextEditor>

                    <Button disabled={loading} onClick={handleUpdate}>
                        {loading ? <Loader2 className="animate-spin" /> : ''}Salvar
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
