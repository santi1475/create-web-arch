# Guía de Contribución

## Estándar de Commits — Conventional Commits

### Formato

```
<tipo>[ámbito opcional]: <descripción corta>

[cuerpo opcional — explica el POR QUÉ, no el cómo]

[pie de página — refs a issues, BREAKING CHANGE]
```

### Tipos permitidos

| Tipo        | Cuándo usarlo                                        |
|-------------|------------------------------------------------------|
| `feat`      | Nueva funcionalidad visible para el usuario          |
| `fix`       | Corrección de bug                                    |
| `docs`      | Solo documentación                                   |
| `style`     | Formato, espacios, comas (sin cambios de lógica)     |
| `refactor`  | Refactorización sin nueva funcionalidad ni bug fix   |
| `test`      | Añadir o corregir tests                              |
| `chore`     | Mantenimiento, dependencias, scripts                 |
| `perf`      | Mejoras de rendimiento                               |
| `ci`        | Cambios en pipelines de CI/CD                        |
| `build`     | Sistema de build, herramientas externas              |
| `revert`    | Revertir un commit anterior                          |

### Ejemplos

```bash
# Feature con ámbito
feat(auth): add Google OAuth login

# Bug fix referenciando issue
fix(cart): prevent duplicate items on rapid click
Closes #234

# Breaking change
feat(api)!: change response envelope to JSON:API spec

BREAKING CHANGE: all API responses are now wrapped in { data, meta }.
Update all fetch calls accordingly.

# Chore simple
chore(deps): upgrade Next.js to 15.3
```

### Reglas clave

- Máximo **50 caracteres** en la línea del título
- Usar **imperativo presente**: `add` no `added`, `fix` no `fixed`
- **No terminar con punto** el título
- Separar cuerpo del título con **línea en blanco**
- El cuerpo explica el **qué y por qué**, no el cómo

---

## Flujo de ramas

```
main          ← producción, protegida, solo merge via PR
develop       ← rama de integración principal
feature/xxx   ← nuevas features  (sale de develop)
fix/xxx       ← bug fixes        (sale de develop)
hotfix/xxx    ← fix urgente      (sale de main)
release/x.x   ← preparación de release
```

### Naming de ramas

```bash
feature/user-authentication
feature/payment-gateway
fix/cart-duplicate-items
hotfix/critical-xss-vulnerability
release/2.1.0
```

---

## Pull Requests

1. El título del PR debe seguir el mismo formato de Conventional Commits
2. Describir qué cambia y por qué
3. Referenciar el issue relacionado (`Closes #123`)
4. Al menos 1 revisión aprobada antes de merge
5. Squash merge hacia `develop`, merge commit hacia `main`

---

## 🏗 Arquitectura y Generadores de Código

Este proyecto utiliza una estructura de carpetas precisa generada por `create-next-arch`. Para mantener la consistencia arquitectónica en todo el equipo, **evita crear archivos y carpetas manualmente**. 

En su lugar, usa siempre los generadores automáticos del CLI:

```bash
# Componentes (Client/Server)
npx create-next-arch generate component MiComponente

# Hooks personalizados
npx create-next-arch generate hook Auth

# Servicios / Integraciones API
npx create-next-arch generate service Usuario

# Funcionalidades completas (Solo si usas arquitectura feature-based)
npx create-next-arch generate feature Checkout
```

El uso de estos comandos garantiza que tus archivos se coloquen en los directorios correctos, que los alias se apliquen sin errores, y que el proyecto se mantenga perfectamente organizado a medida que escala.
