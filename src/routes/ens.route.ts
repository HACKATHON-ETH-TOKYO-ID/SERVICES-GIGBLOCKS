import { Hono } from "hono";
import { getENS } from "../services/ens.services";

const ens = new Hono();

const validateApiKey =
  (apiKey: string) => async (c: any, next: () => Promise<void>) => {
    const providedKey = c.req.header("X-API-Key");
    if (!providedKey || providedKey !== apiKey) {
      return c.json(
        { success: false, error: "Unauthorized: Invalid or missing API key" },
        401
      );
    }
    await next();
  };

// const API_KEY = process.env.API_KEY as string;

ens.get("/", async (c) => {
  const ensName = c.req.query("ensName")?.toString() || "gigblocks.eth";
  let ensData = await getENS(ensName);

  if (!ensData) {
    return c.json(
      { success: false, error: "No address found for ENS name" },
      400
    );
  }
  return c.json({
    success: true,
    ensWalletAddress: ensData,
  });
});

export default ens;
