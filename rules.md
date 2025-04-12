# Code Style Guidelines

## Interfaces

- Start with prefix 'I' (e.g., IProduct, IOrder)
- Avoid defining duplicate interfaces
- If interface is related to Backend schema, extend ISchema
- Place interfaces in types/(resource).ts (e.g., product.ts, order.ts)
- Place generic or common interfaces in types/generic.ts

## Constants

- Use /constants directory
- Place common constants in constants/common.ts
- Name constants in UPPER_CASE

## Mock Data

- Use /mock directory
- Follow the same structure as the actual data

## Contexts

- Use /contexts directory
- Register providers in app/provider.ts

## Pages

- Public pages go in app/(public)
- Private pages go in app/(private)
- Dashboard pages go in app/(private)/h
- Break every page into smaller components

## Components

- Break large files into smaller components
- For private components use components/(private)
- For dashboard components use components/(private)/dashboard/(routename)/
- For generic components use components/ui (mostly shadcn components)

## Hooks

- Prefer hooks over direct static data passing
- Use hooks with static actions instead of just logging
- Place hooks in /hooks directory
- Use Tanstack Query for data fetching hooks
- avoid to create multiple hooks for 1 feature (e.g, we can handle all product operations and queries in useProduct)

## Authentication

- Use Keycloak

## Forms

- Use React Hook Form + Zod instead of useState

## Component Structure

- Imports
- Definition:
  - Custom hooks
  - States
  - Other hooks (useForm, useEffect, etc.)
- Handlers:
  - Use callbacks when possible
  - Name handlers as handleOn...
  - When passing as props, name as on...
- Constants (if needed)
- JSX

read component before using to use full powers
