module.exports = {
  forbidden: [
    {
      from: {
        path: "(\\.logic\\.ts$|^src/lib/format/)",
      },
      name: "logic-is-pure",
      severity: "error",
      to: {
        path: "node_modules/(react|react-dom|next|server-only)/",
      },
    },
    {
      from: {
        path: "^src/features/([^/]+)/",
      },
      name: "features-only-through-index",
      severity: "error",
      to: {
        path: "^src/features/([^/]+)/",
        pathNot: ["^src/features/$1/", "^src/features/[^/]+/index\\.ts$"],
      },
    },
    {
      name: "app-only-through-feature-index",
      severity: "error",
      from: { path: "^src/app/" },
      to: {
        path: "^src/features/",
        pathNot: "^src/features/[^/]+/index\\.ts$",
      },
    },
    {
      from: {
        path: "^src/features/[^/]+/components/",
      },
      name: "components-without-server-code",
      severity: "error",
      to: {
        path: "(^src/features/[^/]+/data\\.ts$|^src/lib/(api|session)/)",
      },
    },
    {
      from: {
        pathNot: "(^src/lib/api/|^src/features/[^/]+/(data|actions)\\.ts$)",
      },
      name: "generated-client-is-encapsulated",
      severity: "error",
      to: {
        path: "^src/lib/api/generated/",
      },
    },
    {
      from: {},
      name: "no-circular",
      severity: "error",
      to: {
        circular: true,
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsConfig: {
      fileName: "tsconfig.json",
    },
    tsPreCompilationDeps: true,
  },
};
