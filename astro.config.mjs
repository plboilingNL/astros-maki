import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { autolinkConfig } from "./plugins/rehype-autolink-config";
import rehypeSlug from "rehype-slug";
import astroI18next from "astro-i18next";
import alpinejs from "@astrojs/alpinejs";
import AstroPWA from "@vite-pwa/astro";
import icon from "astro-icon";
import sveltiaCms from "astro-sveltia-cms";
// import decapCmsOauth from "astro-decap-cms-oauth";
import cloudflare from "@astrojs/cloudflare";
import dotenv from "dotenv";
dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL,
  vite: {
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
    ssr: {
      noExternal: ["dotenv", "@astrojs/cloudflare"],
      target: "webworker",
      external: [
        "path",
        "fs",
        "url",
        "module",
        "crypto",
        "os",
        "child_process",
        "util",
        "net",
      ],
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  env: {
    schema: {
      SITE_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },

  output: "static",
  adapter: cloudflare({
    mode: "directory",
    platformProxy: {
      enabled: true,
      configPath: "./wrangler.toml",
    },
  }),
  integrations: [
    sveltiaCms(),
    decapCmsOauth({
      decapCMSSrcUrl: "https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js",
    }),
    tailwind(),
    sitemap(),
    astroI18next(),
    alpinejs(),

    AstroPWA({
      mode: "production",
      base: "/",
      scope: "/",
      includeAssets: ["favicon.svg"],
      registerType: "autoUpdate",
      manifest: {
        name: "Astros - Starter Template for Astro with Tailwind CSS",
        short_name: "Astros",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/404",
        globPatterns: ["*.js"],
      },
      devOptions: {
        enabled: false,
        navigateFallbackAllowlist: [/^\/404$/],
        suppressWarnings: true,
      },
    }),
    icon(),
  ],
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      // This adds links to headings
      [rehypeAutolinkHeadings, autolinkConfig],
    ],
  },
  experimental: {
    contentCollectionCache: true,
  },
});
