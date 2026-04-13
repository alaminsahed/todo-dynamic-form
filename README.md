# Todo & dynamic form

A React + TypeScript app that lists todos from [JSONPlaceholder](https://jsonplaceholder.typicode.com/) with filters, search, and pagination, plus routes for a form builder and preview (assessment scaffold).

**Live:** [todo-dynamic-form.vercel.app](https://todo-dynamic-form.vercel.app/todos)

## Setup

### Prerequisites

- Node.js (LTS recommended)
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

### Environment variables

Variables must be prefixed with `VITE_` to be exposed to the client.

| Variable           | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `VITE_BASE_URL`    | API base URL for Axios (default in example: JSONPlaceholder). |
| `VITE_ENVIRONMENT` | Set to `development` to enable TanStack Query DevTools; use   |

After changing `.env`, restart the dev server.

## Approach

### Stack

- **Vite**
- **React 19** and **TypeScript**
- **React Router**
- **TanStack Query**
- **Axios**

### Todos page (`/todos`)

| File | Purpose |
|------|---------|
| `pages/todos/index.tsx` | Main page — fetches todos and users via TanStack Query, filters/searches/paginates the cached list, renders sub-components. |
| `pages/todos/components/filters/` | User dropdown, status dropdown, and search input. |
| `pages/todos/components/table/` | Displays the current page of filtered todos with completion badges. |
| `pages/todos/components/pagination/` | Previous/Next buttons and page info. |
| `hooks/useTodosViewState.ts` | Stores filter & pagination UI state (selected user, status, search text, page) in the TanStack Query cache so it persists across route changes. |
| `services/todo.ts`, `services/user.ts` | Axios calls to `/todos` and `/users`. |

**Trade-off — why TanStack Query for UI state instead of Redux or Zustand?**
Redux or Zustand would work fine here. I chose to keep UI state in the Query cache because Query was already in the project for data fetching, so this avoids adding another library. The downside is it's less conventional than a dedicated store, but the hook (`useTodosViewState`) keeps usage clear and isolated.

### Form builder (`/form-builder`)

| File | Purpose |
|------|---------|
| `pages/form-builder/index.tsx` | Page — manages the field list in state, handles add/delete/reorder/save/clear. After saving, fields lock; click "Edit" to unlock. |
| `pages/form-builder/components/FieldRow/` | One editable row per field: label input, type dropdown, required checkbox, options input (for select type), up/down/delete buttons. |
| `hooks/useFormConfig.ts` | Reads and writes the field array to `localStorage`. Shared between builder and preview. |
| `types/form.ts` | `FormField` interface and `FIELD_TYPES` constant. |

### Form preview (`/form-preview`)

| File | Purpose |
|------|---------|
| `pages/form-preview/index.tsx` | Page — reads saved fields from `useFormConfig`, tracks all values in one state object, runs HTML validation on submit, logs `{ label: value }` pairs to the console and shows a success message. Empty state if no form is saved. |
| `pages/form-preview/components/DynamicField/` | Renders the correct input element (`<input>`, `<textarea>`, `<select>`, checkbox) based on `field.type`. |

### Shared / config

| File | Purpose |
|------|---------|
| `styles/shared.module.css` | Common CSS Module classes (page layout, nav button, input/select base, card surface, label) composed by page modules to avoid duplication. |
| `index.css` | CSS variables (`:root`) for colors, radii, shadows — single place to update the palette. |
| `config/axios-config/` | Axios instance with `VITE_BASE_URL`. A hardcoded fallback URL exists for convenience, but in a real project I would avoid that and require the env variable to be set. |
| `routes/public.tsx`, `routes/public.lazy.ts` | Route definitions with lazy-loaded page chunks. |
| `components/loading/` | Full-screen spinner overlay shown during data fetch. |
| `components/page-metadata/` | Sets the document `<title>` per page. |
