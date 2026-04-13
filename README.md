# Todo & dynamic form

A React + TypeScript app that lists todos from [JSONPlaceholder](https://jsonplaceholder.typicode.com/) with filters, search, and pagination, plus routes for a form builder and preview (assessment scaffold).

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node)

### Install and run

1. Clone the repository and open the project root.

2. Copy environment defaults and adjust if needed:

   ```bash
   cp .env.example .env
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open the URL Vite prints in the terminal (usually `http://localhost:5173`). The app redirects to `/todos`.

### Other scripts

| Command           | Purpose                            |
| ----------------- | ---------------------------------- |
| `npm run build`   | Typecheck and production build     |
| `npm run preview` | Serve the production build locally |
| `npm run lint`    | Run ESLint                         |
| `npm run format`  | Format with Prettier               |

### Environment variables

Variables must be prefixed with `VITE_` to be exposed to the client.

| Variable           | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `VITE_BASE_URL`    | API base URL for Axios (default in example: JSONPlaceholder). |
| `VITE_ENVIRONMENT` | Set to `development` to enable TanStack Query DevTools; use   |

After changing `.env`, restart the dev server.

## Approach

### Stack

- **Vite** for bundling and dev server
- **React 19** and **TypeScript**
- **React Router** with lazy-loaded route chunks and a shared loading fallback
- **TanStack Query** for server state (caching, loading and error states)
- **Axios** with a shared client for HTTP requests

### Todos page

Todos and users are fetched once each (`/todos` and `/users`). The API does not support server-side filtering for this use case, so **filtering by user, completion status, and title search happens in the client** on the cached list. Results are **paginated in memory** (fixed page size) so the table stays small and responsive.

**Filter and pagination UI state** (selected user, status, search text, current page) is stored in the **TanStack Query cache** under a dedicated query key, updated with `setQueryData` and read with a disabled `useQuery`. That keeps state **across navigations** (e.g. leaving for Form Builder and returning) without adding another global store, while still using patterns already in the app for server data.

The page is split into small presentational pieces (filters, table, pagination) with typed props. Loading and error paths are handled explicitly; empty filtered results show an in-table message.

### Form builder (`/form-builder`)

The builder lets a user **define an arbitrary set of form fields** before seeing or filling the form. Each field has a label, an input type (text, number, email, textarea, dropdown, checkbox), an optional required flag, and — for dropdowns — a comma-separated list of options.

Fields are kept in local component state while editing. Pressing **Save form** serialises the field array to `localStorage` via a shared `useFormConfig` hook. The hook also exposes `clearFields` and re-reads storage on mount, so definitions survive a page refresh.

Field ordering is managed with simple up/down swap operations on the array. A new field gets a stable UUID (`crypto.randomUUID`) as its key so React never conflates two different rows.

### Form preview (`/form-preview`)

The preview page reads the saved field array from `localStorage` via the same `useFormConfig` hook and **renders each field dynamically** through a `DynamicField` component that switches on the field type. Values are tracked in a single `Record<fieldId, string | boolean>` state object, initialised from the field definitions.

On submission the form's native HTML validation runs first (required fields, email format, etc.). If it passes, the handler collects `{ [field.label]: value }` pairs and calls `console.log` with them, then shows a success indicator in the UI. If no form has been saved, the preview page shows an empty state with a link back to the builder.

### Developer experience

- **React Query DevTools** are mounted when `VITE_ENVIRONMENT` is `development`, so you can inspect queries and the persisted todos view state during local development.
