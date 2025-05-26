import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://covers.openlibrary.org/b/id/**"),
      new URL("https://covers.openlibrary.org/b/olid/**"),
      new URL("https://covers.openlibrary.org/b/isbn/**"),
    ],
  },
};

export default nextConfig;
