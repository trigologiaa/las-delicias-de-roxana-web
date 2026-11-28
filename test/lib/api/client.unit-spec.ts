import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiClient } from "@/lib/api/client";

describe("createApiClient", (): void => {
  afterEach((): void => {
    vi.unstubAllEnvs();
  });

  it.each([undefined, "", "localhost:3000"])(
    "names API_URL when its value is %j",
    (value: string | undefined): void => {
      vi.stubEnv("API_URL", value);
      const create = () => createApiClient();
      expect(create).toThrow("API_URL");
    },
  );
});
