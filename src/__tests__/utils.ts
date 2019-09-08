import { normalizeGenerator } from "../utils";

describe("normalizeGenerator", function() {
  it("should do nothing with empty array", function() {
    const result = normalizeGenerator([]);

    const current = result.next();
    expect(current.done).toBe(true);
  });

  it("should flatten array of empty arrays", function() {
    const result = normalizeGenerator([[], []]);

    const current = result.next();
    expect(current.done).toBe(true);
  });

  it("should flatten nested array with elements", function() {
    const result = normalizeGenerator([1, [2, [3, [4], 5], 6], 7]);

    let current = result.next();
    expect(current.done).toBe(false);
    expect(current.value).toStrictEqual({ node: 1 });

    current = result.next();
    expect(current.done).toBe(false);
    expect(current.value).toStrictEqual({ node: 2 });

    current = result.next();
    expect(current.done).toBe(false);
    expect(current.value).toStrictEqual({ node: 3 });

    current = result.next();
    expect(current.done).toBe(false);
    expect(current.value).toStrictEqual({ node: 4 });

    current = result.next();
    expect(current.done).toBe(false);
    expect(current.value).toStrictEqual({ node: 5 });

    current = result.next();
    expect(current.done).toBe(false);
    expect(current.value).toStrictEqual({ node: 6 });

    current = result.next();
    expect(current.done).toBe(false);
    expect(current.value).toStrictEqual({ node: 7 });

    current = result.next();
    expect(current.done).toBe(true);
  });

  it("should flatten array of generator", function() {
    function* g(initial: number): Generator<[unknown], number> {
      return initial;
    }

    const result = normalizeGenerator([g(1), g(2), g(3)]);

    let current = result.next();
    expect(current.done).toBe(false);
    expect(current.value).toStrictEqual({ node: 1 });

    current = result.next();
    expect(current.done).toBe(false);
    expect(current.value).toStrictEqual({ node: 2 });

    current = result.next();
    expect(current.done).toBe(false);
    expect(current.value).toStrictEqual({ node: 3 });

    current = result.next();
    expect(current.done).toBe(true);
  });

  // ? tests and ensure it flattens gen<gen<T>>, gen<T[]>
});
