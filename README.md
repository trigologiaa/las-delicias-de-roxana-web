# Las Delicias de Roxana WEB

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
