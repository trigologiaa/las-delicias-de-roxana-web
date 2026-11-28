import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type DevServer, startDevServer } from "../support/dev-server";

describe("Home page", (): void => {
  let server: DevServer;

  beforeAll(async (): Promise<void> => {
    server = await startDevServer();
  });

  afterAll(async (): Promise<void> => {
    await server?.stop();
  });

  it("shows the initial page on the development server", async (): Promise<void> => {
    const response: Response = await fetch(server.url);
    const html: string = await response.text();
    expect(response.status).toBe(200);
    expect(html).toMatch(/<h1[^>]*>Las Delicias de Roxana<\/h1>/);
  });
});
