import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FaFacebook, FaInstagram } from "react-icons/fa6"
import { Separator } from "../ui/separator"

export default function Component() {
  return (
    <footer>
      <Separator />
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-20 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            <a
              href="https://www.sicoob.com.br/web/sicoobfrutal"
              target="_blank"
              rel="noreferrer"
              className="font-medium"
            >
              Copyright {new Date().getFullYear()} © - FENEG - Feira de Negócios Sicoob Frutal.{" "}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}