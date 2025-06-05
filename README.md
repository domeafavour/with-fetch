# With Fetch

A lightweight utility for managing asynchronous data fetching operations while updating state in modern JavaScript applications.

[![npm version](https://img.shields.io/npm/v/@domeadev/with-fetch.svg)](https://www.npmjs.com/package/@domeadev/with-fetch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

With Fetch is a simple yet powerful utility for handling data fetching operations that need to update state. It works well with state management libraries and provides a clean way to transform responses and update state in a single operation.

## Installation

### npm

```bash
npm install @domeadev/with-fetch
```

### yarn

```bash
yarn add @domeadev/with-fetch
```

### Using pnpm

```bash
pnpm add @domeadev/with-fetch
```

## Usage

### Basic Example

```ts
import { useMemo, useEffect } from "react";
import { createWithFetchFn } from "@domeadev/with-fetch";

// Example with React's useState
function MyComponent() {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const withFetch = useMemo(
    () =>
      createWithFetchFn((updater) => {
        setState((prev) => ({ ...prev, ...updater(prev) }));
      }),
    []
  );

  useEffect(() => {
    // Automatically updates state.data with the result
    withFetch(
      () => fetch("https://api.example.com/data").then((res) => res.json()),
      "data"
    );
  }, []);

  return null;
}
```

### Advanced Usage

#### With Transform and Reducer

```typescript
const withFetch = createWithFetchFn(setState);

// Transform the response and update multiple state fields
await withFetch(() => fetch("/api/users").then((res) => res.json()), {
  // Transform the response
  transform: (users) =>
    users.map((user) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    })),

  // Update state with transformed result
  reducer: (transformedUsers, currentState) => ({
    users: transformedUsers,
    lastFetched: new Date(),
  }),
});
```

#### With Just a Reducer

```typescript
await withFetch(
  () => fetch("/api/stats").then((res) => res.json()),
  (result, currentState) => ({
    stats: result,
    hasStats: result.length > 0,
    lastUpdated: new Date(),
  })
);
```

#### Synchronous State Management with Zustand and React Query

```tsx
import { createWithFetchFn } from "@domeadev/with-fetch";
import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";

const useStore = create((set) => ({
  users: [] as { id: number; firstName: string; lastName: string }[],
  withFetch: createWithFetchFn(set),
}));

function fetchUsers(): Promise<
  { id: number; first_name: "john"; last_name: "doe" }[]
> {
  return fetch("/api/users").then((res) => res.json());
}

function useUsersQuery() {
  const withFetch = useStore((state) => state.withFetch);
  return useQuery({
    queryKey: ["users"],
    queryFn: () =>
      withFetch(fetchUsers, {
        transform: (users) =>
          users.map((user) => ({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
          })),
        reducer: (transformedUsers, currentState) => ({
          users: transformedUsers,
        }),
      }),
  });
}

function UsersList() {
  const users = useStore((state) => state.users);
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.firstName} {user.lastName}
        </li>
      ))}
    </ul>
  );
}

function App() {
  const { isLoading, error } = useUsersQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching users</div>;

  return (
    <div>
      <h1>Users</h1>
      <UsersList />
    </div>
  );
}
```

## API Reference

### `createWithFetchFn(update)`

Creates a `withFetch` function that can be used to fetch data and update state.

- **Parameters:**

  - `update`: Function that accepts an updater function `(state) => partialState`

- **Returns:** A `withFetch` function with multiple overloaded signatures:

### `withFetch` Signatures

#### Direct key update

```typescript
withFetch<K extends keyof S>(
  fetcher: () => Promise<S[K]>,
  key: K
): Promise<S[K]>
```

#### With transform and reducer

```typescript
withFetch<T, R = T>(
  fetcher: () => Promise<T>,
  options: {
    transform?: (response: T) => R;
    reducer: (result: R, state: S) => Partial<S>;
  }
): Promise<R>
```

#### With just a reducer

```typescript
withFetch<T>(
  fetcher: () => Promise<T>,
  reducer: (result: T, state: S) => Partial<S>
): Promise<T>
```

## License

MIT © [domeafavour](https://github.com/domeafavour)
