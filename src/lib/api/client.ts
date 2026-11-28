import "server-only";
import createClient, { type Client } from "openapi-fetch";
import { type ZodSafeParseResult, type ZodURL, z } from "zod";
import type { paths } from "./generated/schema";

const apiUrl: ZodURL = z.url({
  protocol: /^https?$/,
});

export function createApiClient(): Client<paths> {
  const result: ZodSafeParseResult<string> = apiUrl.safeParse(
    process.env.API_URL,
  );
  if (!result.success) {
    throw new Error("Invalid environment: API_URL must be an http(s) URL");
  }
  return createClient<paths>({
    baseUrl: result.data,
  });
}
