const MINIO_HOSTS = [
  process.env.END_POINT_MINIO,
  "feneg-minio.zj8qie.easypanel.host",
  "feneg-minio.yal8nw.easypanel.host",
].filter(Boolean) as string[]

export function getProxyImageUrl(absoluteUrl: string): string {
  try {
    const url = new URL(absoluteUrl)

    const isMinioUrl = MINIO_HOSTS.some((host) => url.hostname === host)
    if (isMinioUrl) {
      return `/api/images${url.pathname}`
    }

    return absoluteUrl
  } catch {
    return absoluteUrl
  }
}
