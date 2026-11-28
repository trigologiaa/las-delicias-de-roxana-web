import "server-only";
import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

export function createApiClient() {
  return createClient<paths>({
    baseUrl: "http://api.test",
  });
}
