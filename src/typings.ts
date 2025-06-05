export type State = Record<string, any>;
export type Fetcher<T> = () => Promise<T>;

export interface WithFetchOptions<T, R, S extends State> {
  transform: (response: T) => R;
  reducer: (result: R, state: S) => Partial<S>;
}
