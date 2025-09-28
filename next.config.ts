import type { NextConfig } from "next"

const isProd = process.env.NODE_ENV === "production"
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd && basePath ? basePath : undefined,
  assetPrefix: isProd && basePath ? `${basePath}/` : undefined
}

export default nextConfig
