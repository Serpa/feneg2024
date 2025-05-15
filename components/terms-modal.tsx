"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TermsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Termos de Uso e Política de Privacidade - FENEG 2025</DialogTitle>
          <DialogDescription>
            Por favor, leia atentamente os termos de uso e política de privacidade antes de prosseguir com o cadastro.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4 pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. Introdução</h3>
              <p className="text-muted-foreground">
                Bem-vindo aos Termos de Uso e Política de Privacidade da FENEG 2025 - Feira de Negócios Sicoob Frutal.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">2. Aceitação dos Termos</h3>
              <p className="text-muted-foreground">
                Ao se cadastrar em nossa plataforma, você concorda expressamente com todos os termos e condições aqui
                estabelecidos pela FENEG 2025 - Feira de Negócios Sicoob Frutal. Se você não concordar com qualquer
                parte destes termos, solicitamos que não prossiga com o cadastro ou utilização dos nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. Coleta de Dados</h3>
              <p className="text-muted-foreground">
                Para participar da FENEG 2025 - Feira de Negócios Sicoob Frutal, coletamos as seguintes informações:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Nome completo</li>
                <li>CPF (Cadastro de Pessoa Física)</li>
                <li>Informações de contato (telefone/celular)</li>
                <li>Endereço de e-mail (opcional)</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Estes dados são necessários para identificação, comunicação e garantia da segurança de todos os
                participantes do evento.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">4. Uso dos Dados</h3>
              <p className="text-muted-foreground">Utilizamos seus dados pessoais para os seguintes fins:</p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Confirmar sua identidade e participação no evento</li>
                <li>Enviar informações relevantes sobre a Feira de Negócios</li>
                <li>Comunicar alterações de programação, local ou data</li>
                <li>Enviar materiais promocionais relacionados ao evento</li>
                <li>Realizar pesquisas de satisfação após o evento</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">5. Compartilhamento de Dados</h3>
              <p className="text-muted-foreground">Seus dados pessoais poderão ser compartilhados com:</p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Parceiros e patrocinadores do evento (apenas mediante seu consentimento expresso)</li>
                <li>Prestadores de serviços envolvidos na organização do evento</li>
                <li>Autoridades públicas, quando exigido por lei</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Não vendemos, alugamos ou negociamos suas informações pessoais com terceiros para fins de marketing sem
                seu consentimento explícito.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">6. Armazenamento e Segurança</h3>
              <p className="text-muted-foreground">
                Seus dados são armazenados em servidores seguros, protegidos por medidas técnicas e organizacionais
                adequadas contra acesso não autorizado, perda ou alteração. Mantemos seus dados apenas pelo tempo
                necessário para cumprir as finalidades para as quais foram coletados, ou para cumprir obrigações legais.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">7. Seus Direitos</h3>
              <p className="text-muted-foreground">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
                <li>Acesso aos seus dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos</li>
                <li>Portabilidade dos dados</li>
                <li>Eliminação dos dados tratados com seu consentimento</li>
                <li>Informação sobre entidades públicas e privadas com as quais compartilhamos seus dados</li>
                <li>Revogação do consentimento</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">8. Cookies e Tecnologias Semelhantes</h3>
              <p className="text-muted-foreground">
                Nosso site utiliza cookies e tecnologias semelhantes para melhorar sua experiência, analisar o tráfego e
                personalizar conteúdos. Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">9. Alterações na Política de Privacidade</h3>
              <p className="text-muted-foreground">
                Podemos atualizar esta política periodicamente. Recomendamos que você revise este documento regularmente
                para estar ciente de quaisquer alterações. Alterações significativas serão comunicadas através dos
                canais de contato fornecidos.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">10. Contato</h3>
              <p className="text-muted-foreground">
                Para exercer seus direitos ou esclarecer dúvidas sobre nossa Política de Privacidade, entre em contato
                conosco através do e-mail: informatica@sicoobfrutal.com.br
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">11. Disposições Finais</h3>
              <p className="text-muted-foreground">
                Este documento constitui o acordo integral entre você e a FENEG 2025 - Feira de Negócios Sicoob Frutal
                em relação ao uso dos seus dados pessoais. A tolerância quanto ao eventual descumprimento de qualquer
                das cláusulas destes Termos não constituirá novação ou renúncia dos direitos estabelecidos.
              </p>
              <p className="text-muted-foreground mt-2">Última atualização: 15 de maio de 2025.</p>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
