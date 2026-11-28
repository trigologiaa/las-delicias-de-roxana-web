import { spawn } from "node:child_process";
import { type AddressInfo, createServer, type Server } from "node:net";

export interface DevServer {
  url: string;
  stop: () => Promise<void>;
}

async function freePort(): Promise<number> {
  const probe: Server = createServer();
  await new Promise<void>((resolve) => probe.listen(0, resolve));
  const address: string | AddressInfo | null = probe.address();
  await new Promise((resolve) => probe.close(resolve));
  if (address === null || typeof address === "string") {
    throw new Error("Could not find a free port");
  }
  return address.port;
}

export async function startDevServer(): Promise<DevServer> {
  const port: number = await freePort();
  const url: string = `http://localhost:${port}`;
  let output: string = "";
  const server = spawn(
    "node_modules/.bin/next",
    ["dev", "--port", String(port)],
    {
      detached: true,
      env: {
        ...process.env,
        NEXT_DIST_DIR: ".next/acceptance",
        NODE_ENV: "development",
      },
    },
  );
  server.stdout.on("data", (chunk) => {
    output += chunk;
  });
  server.stderr.on("data", (chunk) => {
    output += chunk;
  });
  const exited: Promise<unknown> = new Promise((resolve) =>
    server.once("exit", resolve),
  );
  async function stop(): Promise<void> {
    if (server.exitCode === null && server.pid) {
      process.kill(-server.pid);
    }
    await exited;
  }
  while (server.exitCode === null) {
    if (output.includes("Ready")) {
      return {
        url,
        stop,
      };
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`The dev server stopped before being ready:\n${output}`);
}
