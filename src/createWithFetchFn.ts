import { getResolvedOptions } from "./getResolvedOptions";
import { Fetcher, State } from "./typings";

export function createWithFetchFn<S extends State>(
  update: (updater: (state: S) => Partial<S>) => void
) {
  async function withFetch<K extends keyof S>(
    fetcher: Fetcher<S[K]>,
    key: K
  ): Promise<S[K]>;
  async function withFetch<T, R = T>(
    fetcher: Fetcher<T>,
    options: {
      transform?: (response: T) => R;
      reducer: (result: R, state: S) => Partial<S>;
    }
  ): Promise<R>;
  async function withFetch<T>(
    fetcher: Fetcher<T>,
    reducer: (result: T, state: S) => Partial<S>
  ): Promise<T>;

  async function withFetch<T, R>(fetcher: () => Promise<T>, options: any) {
    const response = await fetcher();
    const { transform, reducer } = getResolvedOptions<T, R, S>(options);
    const result = transform(response) as R;
    update((state) => reducer(result, state));
    return result;
  }

  return withFetch;
}
