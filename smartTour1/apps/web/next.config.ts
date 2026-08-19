import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "react-map-gl", "mapbox-gl"],
}

export default nextConfig
