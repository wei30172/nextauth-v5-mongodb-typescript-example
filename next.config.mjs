import createNextIntlPlugin from "next-intl/plugin"
const withNextIntl = createNextIntlPlugin()

/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose",
    serverComponentsExternalPackages: ["mongoose"]
  }
}

export default withNextIntl(nextConfig)
