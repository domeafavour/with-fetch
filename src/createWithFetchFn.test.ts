import { describe, expect, it, vi } from "vitest";
import { createWithFetchFn } from "./createWithFetchFn";

describe("createWithFetchFn", () => {
  it("should handle basic fetch with key", async () => {
    const update = vi.fn();
    const withFetch = createWithFetchFn(update);
    const mockData = { name: "test" };
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const result = await withFetch(fetcher, "name");

    expect(result).toEqual(mockData);
    expect(update).toHaveBeenCalledWith(expect.any(Function));
    expect(fetcher).toHaveBeenCalled();
  });

  it("should handle fetch with transform and reducer", async () => {
    const update = vi.fn();
    const withFetch = createWithFetchFn(update);
    const mockData = { value: 123 };
    const fetcher = vi.fn().mockResolvedValue(mockData);
    const transform = (data: typeof mockData) => data.value;
    const reducer = (result: number) => ({ count: result });

    const result = await withFetch(fetcher, { transform, reducer });

    expect(result).toBe(123);
    expect(update).toHaveBeenCalledWith(expect.any(Function));
    expect(fetcher).toHaveBeenCalled();
  });

  it("should handle fetch with reducer only", async () => {
    const update = vi.fn();
    const withFetch = createWithFetchFn(update);
    const mockData = { count: 1 };
    const fetcher = vi.fn().mockResolvedValue(mockData);
    const reducer = (result: typeof mockData) => ({ ...result });

    const result = await withFetch(fetcher, reducer);

    expect(result).toEqual(mockData);
    expect(update).toHaveBeenCalledWith(expect.any(Function));
    expect(fetcher).toHaveBeenCalled();
  });
});
