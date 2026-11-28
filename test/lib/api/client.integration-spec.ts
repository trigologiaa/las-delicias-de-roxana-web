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

  it("calls the API declared in API_URL", async (): Promise<void> => {
    vi.stubEnv("API_URL", "http://api.test");
    api.use(
      http.get(
        "http://api.test/v1/health",
        (): HttpResponse<{ status: string; version: string }> => {
          return HttpResponse.json({
            status: "ok",
            version: "9.8.7",
          });
        },
      ),
    );
    const { data } = await createApiClient().GET("/v1/health");
    expect(data).toEqual({
      status: "ok",
      version: "9.8.7",
    });
  });
});
