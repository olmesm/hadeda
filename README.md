# 🐦 Hadeda

Modern Hypermedia Driven Application (HDA) Stack. Heavily inspired by BETH stack and the thoughts of HTMX.

The goal is to achieve something akin to Ruby on Rails' level of productivity and DX.

https://htmx.org/essays/web-security-basics-with-htmx/

## Uses

- [x] bun
- [x] elysia
- [x] typescript
- [x] prisma
- [x] htmx
- [x] alpine.js
- [x] lucia

## Features

- [x] Flexibility on DB choice (due to prisma)
- [x] typesafe
- [ ] hot reload
- [ ] authentication & authorization

## Development

```bash
# Copy .env file and fill out the values
cp .env.example .env

# Install dependencies
bun install
# Run the development server
bun dev
```

### DB

```bash
# Migrations
bunx prisma migrate dev --name "init" --preview-feature

# Schema push
bun run db:push

# Schema fmt
bunx prisma format

# Studio
bun run db:studio
```

## Generators

TBD

## Deployment

TBD

## Structure

- src - Any file that associate with development of Elysia server.
  - index.ts - Entry point for your Elysia server, ideal place for setting global plugin
  - services - Composed of various plugins to be used as a Service Locator
  - controllers - Instances which encapsulate multiple endpoints
  - libs - Utility functions
  - models - Data Type Objects (DTOs) for Elysia instance
  - types - Shared TypeScript type if needed

## Links

- https://github.com/mikestefanello/pagoda
- https://github.com/koutyuke/Elysia_Lucia-auth_Example
- https://docs.gocopper.dev/
- https://gobuffalo.io/documentation/getting_started/directory-structure/
- https://bun.sh/guides/util/hash-a-password
