import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiClient } from "@/lib/api/client";

describe(".env.example", (): void => {
  afterEach((): void => {
    vi.unstubAllEnvs();
  });

  it("declares every variable the web needs", async (): Promise<void> => {
    const content: string = await readFile(".env.example", "utf8");
    const needed: string[] = [
      "API_URL",
      "NEXT_PUBLIC_INSTAGRAM_URL",
      "NEXT_PUBLIC_SITE_URL",
      "NEXT_PUBLIC_WHATSAPP_NUMBER",
    ];
    expect(Object.keys(parseEnv(content)).toSorted()).toEqual(needed);
  });

  it("is enough to create the API client once copied", async (): Promise<void> => {
    const example: NodeJS.Dict<string> = parseEnv(
      await readFile(".env.example", "utf8"),
    );
    vi.stubEnv("API_URL", example.API_URL);
    expect(createApiClient).not.toThrow();
  });
});
