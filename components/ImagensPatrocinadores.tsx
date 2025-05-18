import { prisma } from "@/lib/prisma";
import Image from "next/image";

async function getImages() {
  const images = await prisma.smallImages.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  return images;
}

export default async function ImagensPatrocinadores() {
  const images = await getImages();

  const patrocinadoresOuro = images.filter(img => img.category === 'PatrocinadorOuro');
  const apoioInstitucional = images.filter(img => img.category === 'ApoioInstitucional');
  const parceiros = images.filter(img => img.category === 'Parceiros');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Patrocinadores Ouro */}
      {patrocinadoresOuro.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Patrocinadores Ouro</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 justify-items-center">
            {patrocinadoresOuro.slice(0, 10).map((img) => (
              <div key={img.id} className="w-full max-w-sm flex justify-center">
                <Image
                  src={img.image_url}
                  alt={img.title}
                  width={180}
                  height={180}
                />
              </div>
            ))}
          </div>
        </div>)}

      {/* Apoio Institucional */}
      {apoioInstitucional.length > 0 && (<div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Apoio Institucional</h2>
        <div className="flex justify-center">
          {apoioInstitucional.slice(0, 2).map((img) => (
            <div key={img.id} className="w-full max-w-md flex justify-center ">
              <Image
                src={img.image_url}
                alt={img.title}
                width={180}
                height={180}
              />
            </div>
          ))}
        </div>
      </div>)}


      {/* Parceiros */}
      {parceiros.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Parceiros</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
            {parceiros.map((img) => (
              <div key={img.id} className="w-full max-w-xs flex justify-center">
                <Image
                  src={img.image_url}
                  alt={img.title}
                  width={180}
                  height={180}
                />
              </div>
            ))}
          </div>
        </div>)}

    </div>
  );
} 