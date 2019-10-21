/** @jsx u */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { u } from "../";
import { flattenChildren } from "../utils";

describe("flattenChildren", function() {
  it("should do nothing with empty array", function() {
    const childrenGen = flattenChildren([]);

    const childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(true);
  });

  it("should flatten array of empty arrays", function() {
    const childrenGen = flattenChildren([[], []]);

    const childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(true);
  });

  it("should flatten nested array with elements", function() {
    const childrenGen = flattenChildren([1, [2, [3, [4], 5], 6], 7]);

    let childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(1);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(2);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(3);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(4);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(5);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(6);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(7);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(true);
  });

  function g<T extends Internal.ChildrenInJsx>(
    ...args: T[]
  ): {
    childrenGenerator: Generator<Internal.ChildrenInJsx>;
  } {
    return {
      childrenGenerator: (function*() {
        yield* args;
      })()
    };
  }

  it("should flatten children generator", function() {
    const childrenGen = flattenChildren(g(1, 2, 3));

    let childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(1);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(2);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(3);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(true);
  });

  it("should flatten array of children generator", function() {
    const childrenGen = flattenChildren([g(1, 2), g(3, 4), g(5, 6)]);

    let childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(1);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(2);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(3);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(4);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(5);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(6);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(true);
  });

  it("should flatten children generator of array", function() {
    const childrenGen = flattenChildren(g([1, 2], [3, 4], [5, 6]));

    let childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(1);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(2);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(3);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(4);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(5);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(6);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(true);
  });

  it("should flatten children generator of children generator", function() {
    const childrenGen = flattenChildren(g(g(1, 2), g(3, 4), g(5, 6)));

    let childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(1);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(2);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(3);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(4);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(5);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);
    expect(childrenGenResult.value).toBe(6);

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(true);
  });

  it("should flatten components", function() {
    const C: Internal.Component = function*() {
      const [n] = yield [1];
      return yield* <div>{n}</div>;
    };

    const childrenGen = flattenChildren(g([<C />]));

    let childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(false);

    const childElGen = childrenGenResult.value;
    //{`gen`| values: [], return: { tag: "div", attributes: {}, children: {`gen`} } }

    let childElGenResult = childElGen.next();
    expect(childElGenResult.done).toBe(false);
    const childElYieldValue = childElGenResult.value;
    expect(childElYieldValue).toStrictEqual([1]);

    childElGenResult = childElGen.next([childElYieldValue[0]]);
    expect(childElGenResult.done).toBe(true);
    if (childElGenResult.done && typeof childElGenResult.value === "object") {
      const childEl = childElGenResult.value;
      //{ tag: "div", attributes: {}, children: {`gen`} }
      expect(childEl.tag).toBe("div");
      expect(childEl.attributes).toStrictEqual({});

      const grandchildrenGen = childEl.children;
      //{`gen`| values: [
      //  1
      //], return: ! }

      let grandchildrenGenResult = grandchildrenGen.next();
      expect(grandchildrenGenResult.done).toBe(false);
      expect(grandchildrenGenResult.value).toBe(1);

      grandchildrenGenResult = grandchildrenGen.next();
      expect(grandchildrenGenResult.done).toBe(true);
    } else {
      throw new Error("failed");
    }

    childrenGenResult = childrenGen.next();
    expect(childrenGenResult.done).toBe(true);
  });
});
