import { State, WithFetchOptions } from "./typings";

function defaultTransform(response: any) {
  return response;
}

export function getResolvedOptions<T, R, S extends State>(
  options:
    | keyof S
    | WithFetchOptions<T, R, S>["reducer"]
    | WithFetchOptions<T, R, S>
): WithFetchOptions<T, R, S> {
  // reducer function
  if (typeof options === "function") {
    return {
      transform: defaultTransform,
      reducer: options,
    };
  }
  // keyof S
  if (typeof options === "string") {
    return {
      transform: defaultTransform,
      reducer: (result: R) => ({ [options]: result } as Partial<S>),
    };
  }
  return options as WithFetchOptions<T, R, S>;
}
