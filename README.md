# Las Delicias de Roxana WEB

Web en Next.js (App Router) con TypeScript, Tailwind y shadcn/ui.

## Requisitos

- Node, en la versión de `.nvmrc`.
- pnpm.

## Cómo levantar el proyecto

```bash
nvm use
pnpm install
cp .env.example .env
pnpm dev
```

La web queda en <http://localhost:3001>. Las variables de entorno están documentadas en `.env.example`. Nada secreto lleva el prefijo `NEXT_PUBLIC_` ya esas variables llegan al navegador.

Para ejecutar la versión compilada se usa `pnpm build && pnpm start`.

## Ciente de la API

El contrato en `openapi.json`, y de este salen los tipos de `src/lib/api/generated/` (no se editan a mano). Las llamadas se hacen desde el servidor con `createApiClient()`.

Para la generación del cliente:

```bash
pnpm api:generate
```

Para traer antes el contrato de la API local (en el puerto 3000):

```bash
curl -fsS http://localhost:3000/docs-json -o openapi.json
pnpm api:generate
```

## Estructura

```text
src/
  app/                 Rutas finas: componen, no deciden
  features/<feature>/  components/ · data.ts · actions.ts · *.logic.ts · *.types.ts · index.ts
  components/ui/       shadcn/ui
  lib/api/             client.ts (solo servidor) y generated/
test/                  Espejo de src/
```

El navegador solo habla con Next (BFF); Next habla con la API. Las lecturas van en `data.ts` y las escrituras en `actions.ts` (Server Actions). Todavía sin TanStack Query.

`pnpm arch:check` verifica que:

- la lógica pura no importe React ni Next;
- una feature (o una ruta) use otra feature solo por su `index.ts`;
- los componentes no importen código de servidor;
- el cliente generado se use solo desde `lib/api`, `data.ts` y `actions.ts`;
- no haya dependencias circulares.

## Scripts

| Comando                       | Qué hace                                        |
| ----------------------------- | ----------------------------------------------- |
| `./scripts/verify.sh`         | Verificación completa                           |
| `./scripts/verify.sh fast`    | Lint, tipos, arquitectura y tests unitarios     |
| `pnpm dev`                    | Servidor de desarrollo                          |
| `pnpm build` / `pnpm start`   | Compila / sirve la versión compilada            |
| `pnpm lint` / `pnpm lint:fix` | Biome: revisar / corregir                       |
| `pnpm typecheck`              | TypeScript sin emitir                           |
| `pnpm arch:check`             | Límites entre carpetas                          |
| `pnpm test`                   | Todos los tests                                 |
| `pnpm test:unit`              | Tests unitarios                                 |
| `pnpm test:integration`       | Adaptadores contra una API simulada             |
| `pnpm test:acceptance`        | Criterios de aceptación                         |
| `pnpm check`                  | Lint, tipos y tests                             |
| `pnpm api:generate`           | Genera los tipos de la API                      |
| `pnpm api:check`              | Falla si los tipos no coinciden con el contrato |

## Flujo de ramas

El código se promueve entre ramas en el siguiente orden:

```
main -> test -> prod
```

| Rama   | Propósito                | Reglas                                              |
| ------ | ------------------------ | --------------------------------------------------- |
| `main` | Desarrollo e integración | Sin force push ni borrado. Se permite push directo. |
| `test` | Pruebas                  | Solo mediante PR. Sin force push ni borrado.        |
| `prod` | Producción               | Solo mediante PR. Sin force push ni borrado.        |

### Promociones

- Las promociones `main -> test` y `test -> prod` se hacen con **merge commit**, nunca con squash ni rebase.
- Cada promoción se realiza con un Pull Request.

### Integración continua (CI)

El check de CI (`check`) va a ser obligatorio en las tres ramas, pero **se activa cuando exista el CI**. Mientras no exista el job `check`, las reglas de ramas no lo exigen.
