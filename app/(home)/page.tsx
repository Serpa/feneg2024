import CarrouselIndex from "@/components/carrousel-index";
import HomeVideo from "@/components/homeVideo";
import SetoresParticipantes from "@/components/setores";
import ImagensPatrocinadores from "@/components/ImagensPatrocinadores";

export default async function Home() {

  return (
    <>
      <div className="mx-auto max-w-7xl w-full text-verde-escuro">
        <div className="flex flex-col space-y-4 w-full justify-center items-center py-5">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">FENEG 2025 - Feira de Negócios Sicoob Frutal.</h1>
          <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Sua porta para o futuro dos negócios em Frutal e Região!
            Descubra oportunidades, faça networking e impulsione seu crescimento.
          </p>
        </div>
        <div className="flex justify-center align-middle items-center">
          <CarrouselIndex />
        </div>
        <SetoresParticipantes />
        <HomeVideo />
        <ImagensPatrocinadores />
      </div>
    </>
  );
}
