import CarrouselIndex from "@/components/carrousel-index";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-col w-full p-10 items-center">
        <CarrouselIndex/>
      </div>
      <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro incidunt, magnam praesentium eum quo maxime. Est ipsa neque impedit nulla! Aliquid blanditiis necessitatibus quibusdam minima voluptas officiis, omnis assumenda exercitationem?</div>
    </>
  );
}
