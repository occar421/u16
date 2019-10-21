/** @jsx u */
import { u, map } from "../../index";

const ReturnsStringSimply: u.Component<{ foo: string }> = function*({ foo }) {
  return `~${foo}~`;
};
const ReturnsSpanSimply: u.Component<{ foo: string }> = function*({ foo }) {
  return yield* <span>{foo}</span>;
};
const ReturnsPreWith1Yield: u.Component<{ foo: string }> = function*({ foo }) {
  const [a] = yield ["bar"];
  return yield* <pre>{`${a}-${foo}`}</pre>;
};
const ReturnsListsOrDivWithChildren: u.Component<{ foo: string }> = function*({
  foo,
  children
}) {
  if (children) {
    return yield* <ul>{map(([c]) => <li>{c}</li>)(children)}</ul>;
  } else {
    return yield* <div>{foo}</div>;
  }
};
const ReturnsUserDefinedElement: u.Component<{ foo: string }> = function*({
  foo
}) {
  return yield* <ReturnsSpanSimply foo={foo} />;
};

describe("User-defined components", function() {
  it("which returns string simply", function() {
    const rootElGen = <ReturnsStringSimply foo="a" />;
    //{`gen`| values: [], return: "~a~" }

    const rootElGenResult = rootElGen.next();
    expect(rootElGenResult.done).toBe(true);
    expect(rootElGenResult.value).toBe("~a~");
  });

  it("which returns element simply", function() {
    const rootElGen = <ReturnsSpanSimply foo="a" />;
    //{`gen`| values: [], return: { tag: "span", attributes: {}, children: {`gen`| values: [
    //  "a"
    //], return: ! }

    const rootElGenResult = rootElGen.next();
    expect(rootElGenResult.done).toBe(true);
    if (rootElGenResult.done && typeof rootElGenResult.value === "object") {
      const rootEl = rootElGenResult.value;
      //{ tag: "div", attributes: {}, children: {`gen`} }
      expect(rootEl.tag).toBe("span");
      expect(rootEl.attributes).toStrictEqual({});
      const childrenGen = rootEl.children;
      //{`gen`| values: [
      //  "a"
      //], return: ! }

      let childrenGenResult = childrenGen.next();
      expect(childrenGenResult.done).toBe(false);
      expect(childrenGenResult.value).toBe("a");

      childrenGenResult = childrenGen.next();
      expect(childrenGenResult.done).toBe(true);
    } else {
      throw new Error("failed");
    }
  });

  it("which returns element with one yield", function() {
    const rootElGen = <ReturnsPreWith1Yield foo="a" />;
    //{`gen`| values: [
    //  ["bar"]
    //], return: { tag: "pre", attributes: {}, children: {`gen`| values: [
    //  "bar-a"
    //]}

    let rootElGenResult = rootElGen.next();
    expect(rootElGenResult.done).toBe(false);
    if (!rootElGenResult.done) {
      expect(rootElGenResult.value).toStrictEqual(["bar"]);
      rootElGenResult = rootElGen.next([rootElGenResult.value]);
      expect(rootElGenResult.done).toBe(true);
      if (rootElGenResult.done && typeof rootElGenResult.value === "object") {
        const rootEl = rootElGenResult.value;
        //{ tag: "pre", attributes: {}, children: {`gen`} }
        expect(rootEl.tag).toBe("pre");
        expect(rootEl.attributes).toStrictEqual({});
        const childrenGen = rootEl.children;
        //{`gen`| values: [
        //  "bar-a"
        //], return: ! }

        let childrenGenResult = childrenGen.next();
        expect(childrenGenResult.done).toBe(false);
        expect(childrenGenResult.value).toBe("bar-a");

        childrenGenResult = childrenGen.next();
        expect(childrenGenResult.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    } else {
      throw new Error("failed");
    }
  });

  interface YieldSim {
    type: "yield-sim";
    el: u.JSX.Element;
    yields: [unknown][];
  }

  function yieldSim(yields: [unknown][], el: u.JSX.Element): YieldSim {
    return { type: "yield-sim", el, yields };
  }

  function areIdenticalInSimulation(
    elGenActual: u.JSX.Element,
    elGenExpectedArg: u.JSX.Element | YieldSim
  ): void {
    const elGenExpected =
      "type" in elGenExpectedArg && elGenExpectedArg.type === "yield-sim"
        ? (function*() {
            yield* elGenExpectedArg.yields;
            return yield* elGenExpectedArg.el;
          })()
        : (elGenExpectedArg as u.JSX.Element);

    let valueActual = undefined;
    let elGenResultActual = elGenActual.next([valueActual]);
    let valueExpected = undefined;
    let elGenResultExpected = elGenExpected.next([valueExpected]);
    expect(elGenResultActual.done).toBe(elGenResultExpected.done);
    while (!elGenResultActual.done) {
      valueActual = elGenResultActual.value;
      valueExpected = elGenResultExpected.value;
      // @ts-ignore
      expect(valueActual).toStrictEqual(valueExpected);
      elGenResultActual = elGenActual.next([valueActual]);
      elGenResultExpected = elGenExpected.next([valueExpected]);
      expect(elGenResultActual.done).toBe(elGenResultExpected.done);
    }

    expect(typeof elGenResultActual.value).toBe(typeof elGenResultActual.value);
    if (typeof elGenResultActual.value !== "object") {
      expect(elGenResultActual.value).toBe(elGenResultExpected.value);
      return;
    }

    const elActual = elGenResultActual.value;
    // @ts-ignore
    const elExpected: typeof elActual = elGenResultExpected.value;
    expect(elActual.tag).toBe(elExpected.tag);
    expect(elActual.attributes).toStrictEqual(elExpected.attributes);

    const childrenGenActual = elActual.children;
    const childrenGenExpected = elExpected.children;

    let childrenGenResultActual = childrenGenActual.next();
    let childrenGenResultExpected = childrenGenExpected.next();
    expect(childrenGenResultActual.done).toBe(childrenGenResultActual.done);
    while (!childrenGenResultActual.done) {
      expect(typeof childrenGenResultActual.value).toBe(
        typeof childrenGenResultExpected.value
      );
      if (typeof childrenGenResultActual.value === "object") {
        areIdenticalInSimulation(
          childrenGenResultActual.value,
          childrenGenResultExpected.value
        );
      } else {
        expect(childrenGenResultActual.value).toBe(
          childrenGenResultExpected.value
        );
      }
      childrenGenResultActual = childrenGenActual.next();
      childrenGenResultExpected = childrenGenExpected.next();
      expect(childrenGenResultActual.done).toBe(childrenGenResultActual.done);
    }
  }

  it("1 simple custom-component child", function() {
    const actual = (
      <ReturnsListsOrDivWithChildren foo="a">
        <ReturnsStringSimply foo="b" />
      </ReturnsListsOrDivWithChildren>
    );

    const expected = (
      <ul>
        <li>
          <ReturnsStringSimply foo="b" />
        </li>
      </ul>
    );

    areIdenticalInSimulation(actual, expected);
  });

  it("2 simple custom-component children", function() {
    const actual = (
      <ReturnsListsOrDivWithChildren foo="a">
        <ReturnsStringSimply foo="b" />
        <ReturnsStringSimply foo="c" />
      </ReturnsListsOrDivWithChildren>
    );

    const expected = (
      <ul>
        <li>
          <ReturnsStringSimply foo="b" />
        </li>
        <li>
          <ReturnsStringSimply foo="c" />
        </li>
      </ul>
    );

    areIdenticalInSimulation(actual, expected);
  });

  it("1 custom-component with yielding child", function() {
    const actual = (
      <ReturnsListsOrDivWithChildren foo="a">
        <ReturnsPreWith1Yield foo="b" />
      </ReturnsListsOrDivWithChildren>
    );

    const expected = (
      <ul>
        <li>{yieldSim([["bar"]], <pre>bar-b</pre>)}</li>
      </ul>
    );

    areIdenticalInSimulation(actual, expected);
  });

  it("2 custom-component with yielding children", function() {
    const actual = (
      <ReturnsListsOrDivWithChildren foo="a">
        <ReturnsPreWith1Yield foo="b" />
        <ReturnsPreWith1Yield foo="c" />
      </ReturnsListsOrDivWithChildren>
    );

    const expected = (
      <ul>
        <li>{yieldSim([["bar"]], <pre>bar-b</pre>)}</li>
        <li>{yieldSim([["bar"]], <pre>bar-c</pre>)}</li>
      </ul>
    );

    areIdenticalInSimulation(actual, expected);
  });

  it("which returns custom-component", function() {
    const actual = <ReturnsUserDefinedElement foo="a" />;

    const expected = <ReturnsSpanSimply foo="a" />;

    areIdenticalInSimulation(actual, expected);
  });
});
