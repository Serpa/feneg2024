import { RegistrationForm } from "@/components/registration-form"

export default function BusinessFairRegistration() {
  return (
    <div className="min-h-screenflex flex-col items-center justify-center p-4">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">FENEG - Feira de Negócios Sicoob Frutal.</h1>
          <p className="text-slate-600 mt-2">Cadastre seu interesse em participar do nosso evento</p>
        </div>

        <RegistrationForm />
      </div>
    </div>
  )
}
