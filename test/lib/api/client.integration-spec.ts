import { HttpResponse, http } from "msw";
import { type SetupServer, setupServer } from "msw/node";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { createApiClient } from "@/lib/api/client";

const api: SetupServer = setupServer();

describe("API client", (): void => {
  beforeAll((): void => {
    api.listen({
      onUnhandledFrame: "error",
    });
  });

  afterEach((): void => {
    api.resetHandlers();
    vi.unstubAllEnvs();
  });

  afterAll((): void => {
    api.close();
  });

  it.each([
    ["http://api.test", "9.8.7"],
    ["http://other-api.test:4000", "1.2.3"],
  ])(
    "calls the API declared in API_URL (%s)",
    async (url, version): Promise<void> => {
      vi.stubEnv("API_URL", url);
      api.use(
        http.get(
          `${url}/v1/health`,
          (): HttpResponse<{ status: string; version: string }> => {
            return HttpResponse.json({
              status: "ok",
              version,
            });
          },
        ),
      );
      const { data } = await createApiClient().GET("/v1/health");
      expect(data).toEqual({
        status: "ok",
        version,
      });
    },
  );
});
