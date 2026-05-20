import Image from "next/image"
import { getProxyImageUrl } from "@/lib/image-proxy"
import type { ComponentProps } from "react"

export function MinioImage({ src, ...props }: ComponentProps<typeof Image>) {
  const proxySrc = typeof src === "string" ? getProxyImageUrl(src) : src
  return <Image src={proxySrc} unoptimized {...props} />
}
