/** @jsx u */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { u } from "../";
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

  it("should flatten components", function() {
    const C: Internal.Component = function*() {
      const [n] = yield [1];
      return yield* <div>{n}</div>;
    };

    const result = normalizeGenerator([<C />]);

    let current = result.next();
    expect(current.done).toBe(false); // yield [1]

    current = result.next();
    expect(current.done).toBe(false);
    if (
      !current.done &&
      "node" in current.value &&
      typeof current.value.node === "object"
    ) {
      const node = current.value.node;
      expect(node.tag).toBe("div");
      expect(node.attributes).toStrictEqual({});
      let child = node.children.next();
      expect(child.done).toBe(false);
      expect(child.value).toStrictEqual({ node: 1 });
      child = node.children.next();
      expect(child.done).toBe(true);
    } else {
      throw new Error("failed");
    }

    current = result.next();
    expect(current.done).toBe(true);
  });

  // ? tests and ensure it flattens gen<gen<T>>, gen<T[]>
});
