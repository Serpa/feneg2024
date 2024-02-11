import CarrouselIndex from "@/components/carrousel-index";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <>
      <div className="mx-auto max-w-7xl w-full text-verde-escuro">
        <div className="grid items-center gap-6 lg:grid-cols-2 px-4 py-12 md:px-6 md:py-12 lg:py-24">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">FENEG 2024 - Feira de Negócios Sicoob Frutal.</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Sua porta para o futuro dos negócios em Frutal!
              Descubra oportunidades, faça networking e impulse seu crescimento.
            </p>
          </div>
          <div className="w-full">
            <CarrouselIndex />
          </div>
        </div>
      </div>
    </>
  );
}
