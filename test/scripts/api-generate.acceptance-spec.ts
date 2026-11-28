import { execFile } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const run: typeof execFile.__promisify__ = promisify(execFile);
const GENERATED_SCHEMA_PATH: string = "src/lib/api/generated/schema.ts";

describe("pnpm api:generate", (): void => {
  it("creates the API types from the OpenAPI contract", async (): Promise<void> => {
    await rm(GENERATED_SCHEMA_PATH, {
      force: true,
    });
    await run("pnpm", ["api:generate"]);
    const generated: string = await readFile(GENERATED_SCHEMA_PATH, "utf8");
    expect(generated).toContain('"/v1/health"');
    expect(generated).toContain("HealthResponseDto");
  });
});
