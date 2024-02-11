import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function FormEmail({ nome, empresa, ramo, telefone, email }: { nome: string, empresa: string, ramo: string, telefone: string, email: string }) {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Novo Cadastro!</CardTitle>
                <CardDescription>{nome.toUpperCase()} está buscando informações!</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" value={nome} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input id="company" value={empresa} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="branch">Ramo</Label>
                        <Input id="branch" value={ramo} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tel">Telefone</Label>
                        <Input id="tel" value={telefone} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" value={email} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}