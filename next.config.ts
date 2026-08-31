import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isProjectPage = process.env.GITHUB_ACTIONS === "true" && !repositoryName.endsWith(".github.io");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isProjectPage ? `/${repositoryName}` : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
