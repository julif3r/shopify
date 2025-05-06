import express, { Request, Response, NextFunction } from "express";
import { shopifyApi, RequestedTokenType, SessionTokenDecoded } from "@shopify/shopify-api";

const router = express.Router();
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: "unstable",
  appUrl: process.env.SHOPIFY_APP_URL || "",
  scopes: process.env.SCOPES?.split(","),
  hostScheme: process.env.HOST?.split("://")[0],
  hostName: process.env.HOST?.replace(/https?:\/\//, ""),
  isEmbeddedApp: true,
});

function getSessionTokenHeader(request: Request): string | null {
  return request.headers["authorization"]?.replace("Bearer ", "") || null;
}

function getSessionTokenFromUrlParam(request: Request): string | null {
  const searchParams = new URLSearchParams(request.url);
  return searchParams.get("id_token");
}

function redirectToSessionTokenBouncePage(req: Request, res: Response): void {
  const searchParams = new URLSearchParams(req.query as Record<string, string>);
  searchParams.delete("id_token");
  searchParams.append(
    "shopify-reload",
    `${req.path}?${searchParams.toString()}`,
  );
  res.redirect(`/session-token-bounce?${searchParams.toString()}`);
}

router.get("/session-token-bounce", async function (req: Request, res: Response, next: NextFunction) {
  res.setHeader("Content-Type", "text/html");
  const html = `
  <head>
      <meta name="shopify-api-key" content="${process.env.SHOPIFY_API_KEY}" />
      <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
  </head>
  `;
  res.send(html);
});

router.get("/authorize", async function (req: Request, res: Response, next: NextFunction) {
  let encodedSessionToken: string | null = null;
  let decodedSessionToken: SessionTokenDecoded | null = null;
  try {
    encodedSessionToken =
      getSessionTokenHeader(req) || getSessionTokenFromUrlParam(req);

    if (!encodedSessionToken) {
      throw new Error("Session token not found");
    }

    decodedSessionToken =
      await shopify.session.decodeSessionToken(encodedSessionToken);
  } catch (e) {
    const isDocumentRequest = !req.headers["authorization"];
    if (isDocumentRequest) {
      return redirectToSessionTokenBouncePage(req, res);
    }
    res.status(401).set({
      "X-Shopify-Retry-Invalid-Session-Request": "1",
    }).send("Unauthorized");
    return;
  }

  const dest = new URL(decodedSessionToken!.dest);
  const shop = dest.hostname;
  const accessToken = await shopify.auth.tokenExchange({
    shop,
    sessionToken: encodedSessionToken!,
    requestedTokenType: RequestedTokenType.OnlineAccessToken,
  });

  res.setHeader("Content-Type", "text/html");
  const html = `
  <body>
    <h1>Retrieved access Token</h1>
    <p>${JSON.stringify(accessToken, null, 2)}</p>
  </body>`;
  res.send(html);
});

export default router;
