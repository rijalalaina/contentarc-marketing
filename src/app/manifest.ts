import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ContentArc",
    short_name: "ContentArc",
    description: "One idea. Endless posts.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaff",
    theme_color: "#22243e",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
