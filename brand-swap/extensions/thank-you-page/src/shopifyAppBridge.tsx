// utils/shopifyAppBridge.ts
import createApp from "@shopify/app-bridge";

export function getAppBridge() {
  if (typeof window === "undefined") {
    throw new Error("App Bridge must be initialized in the browser");
  }

  const host = new URLSearchParams(location.search).get("host");
  const apiKey = process.env.SHOPIFY_API_KEY || "";

  if (!host) {
    throw new Error("Missing host query param");
  }

  return createApp({
    apiKey,
    host,
    forceRedirect: true,
  });
}
