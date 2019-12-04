/** @jsx u */
import { u, map } from "../../index";

const ReturnsStringSimply: u.Component<{ foo: string }> = async function*({
  foo
}) {
  return `~${foo}~`;
};

const ReturnsSpanSimply: u.Component<{ foo: string }> = async function*({
  foo
}) {
  return yield* (<span>{foo}</span>);
};

const ReturnsPreWith1Yield: u.Component<{ foo: string }> = async function*({
  foo
}) {
  const [a] = yield ["bar"];
  return yield* (<pre>{`${a}-${foo}`}</pre>);
};

async function pseudoFetch(): Promise<string> {
  return "buz";
}

const ReturnsPreWith1AwaitYield: u.Component<{
  foo: string;
}> = async function*({ foo }) {
  const [a] = yield [await pseudoFetch()];
  return yield* (<pre>{`${a}-${foo}`}</pre>);
};

const ReturnsListsOrDivWithChildren: u.Component<{
  foo: string;
}> = async function*({ foo, children }) {
  if (children) {
    return yield* (<ul>{map(([c]) => <li>{c}</li>)(children)}</ul>);
  } else {
    return yield* (<div>{foo}</div>);
  }
};

const ReturnsUserDefinedElement: u.Component<{
  foo: string;
}> = async function*({ foo }) {
  return yield* (<ReturnsSpanSimply foo={foo} />);
};

// shim
function assert(condition: unknown): asserts condition {
  expect(condition).toBe(true);
}

describe("User-defined components", function() {
  it("which returns string simply", async function() {
    const rootElGen = <ReturnsStringSimply foo="a" />;
    //{`gen`| values: [], return: "~a~" }

    const rootElGenResult = await rootElGen.next();
    expect(rootElGenResult.done).toBe(true);
    expect(rootElGenResult.value).toBe("~a~");
  });

  it("which returns element simply", async function() {
    const rootElGen = <ReturnsSpanSimply foo="a" />;
    //{`gen`| values: [], return: { tag: "span", attributes: {}, children: {`gen`| values: [
    //  "a"
    //], return: ! }

    const rootElGenResult = await rootElGen.next();
    assert(rootElGenResult.done);
    assert(typeof rootElGenResult.value === "object");
    {
      const rootEl = rootElGenResult.value;
      //{ tag: "div", attributes: {}, children: {`gen`} }
      expect(rootEl.tag).toBe("span");
      expect(rootEl.attributes).toStrictEqual({});
      const childrenGen = rootEl.children;
      //{`gen`| values: [
      //  "a"
      //], return: ! }

      let childrenGenResult = await childrenGen.next();
      expect(childrenGenResult.done).toBe(false);
      expect(childrenGenResult.value).toBe("a");

      childrenGenResult = await childrenGen.next();
      expect(childrenGenResult.done).toBe(true);
    }
  });

  it("which returns element with one yield", async function() {
    const rootElGen = <ReturnsPreWith1Yield foo="a" />;
    //{`gen`| values: [
    //  ["bar"]
    //], return: { tag: "pre", attributes: {}, children: {`gen`| values: [
    //  "bar-a"
    //]}

    let rootElGenResult = await rootElGen.next();
    assert(!rootElGenResult.done);
    {
      expect(rootElGenResult.value).toStrictEqual(["bar"]);
      rootElGenResult = await rootElGen.next([rootElGenResult.value]);
      assert(rootElGenResult.done);
      assert(typeof rootElGenResult.value === "object");
      {
        const rootEl = rootElGenResult.value;
        //{ tag: "pre", attributes: {}, children: {`gen`} }
        expect(rootEl.tag).toBe("pre");
        expect(rootEl.attributes).toStrictEqual({});
        const childrenGen = rootEl.children;
        //{`gen`| values: [
        //  "bar-a"
        //], return: ! }

        let childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(false);
        expect(childrenGenResult.value).toBe("bar-a");

        childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(true);
      }
    }
  });

  it("which returns element with one await yield", async function() {
    const rootElGen = <ReturnsPreWith1AwaitYield foo="a" />;
    //{`gen`| values: [
    //  ["buz"]
    //], return: { tag: "pre", attributes: {}, children: {`gen`| values: [
    //  "buz-a"
    //]}

    let rootElGenResult = await rootElGen.next();
    assert(!rootElGenResult.done);
    {
      expect(rootElGenResult.value).toStrictEqual(["buz"]);
      rootElGenResult = await rootElGen.next([rootElGenResult.value]);
      assert(rootElGenResult.done);
      assert(typeof rootElGenResult.value === "object");
      {
        const rootEl = rootElGenResult.value;
        //{ tag: "pre", attributes: {}, children: {`gen`} }
        expect(rootEl.tag).toBe("pre");
        expect(rootEl.attributes).toStrictEqual({});
        const childrenGen = rootEl.children;
        //{`gen`| values: [
        //  "bar-a"
        //], return: ! }

        let childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(false);
        expect(childrenGenResult.value).toBe("buz-a");

        childrenGenResult = await childrenGen.next();
        expect(childrenGenResult.done).toBe(true);
      }
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

  async function areIdenticalInSimulation(
    elGenActual: u.JSX.Element,
    elGenExpectedArg: u.JSX.Element | YieldSim
  ): Promise<void> {
    const elGenExpected =
      "type" in elGenExpectedArg && elGenExpectedArg.type === "yield-sim"
        ? (async function*() {
            yield* elGenExpectedArg.yields;
            return yield* elGenExpectedArg.el;
          })()
        : (elGenExpectedArg as u.JSX.Element);

    let valueActual = undefined;
    let elGenResultActual = await elGenActual.next([valueActual]);
    let valueExpected = undefined;
    let elGenResultExpected = await elGenExpected.next([valueExpected]);
    expect(elGenResultActual.done).toBe(elGenResultExpected.done);
    while (!elGenResultActual.done) {
      valueActual = elGenResultActual.value;
      valueExpected = elGenResultExpected.value;
      expect(valueActual).toStrictEqual(valueExpected);
      elGenResultActual = await elGenActual.next([valueActual]);
      elGenResultExpected = await elGenExpected.next([valueExpected]);
      expect(elGenResultActual.done).toBe(elGenResultExpected.done);
    }

    expect(typeof elGenResultActual.value).toBe(typeof elGenResultActual.value);
    if (typeof elGenResultActual.value !== "object") {
      expect(elGenResultActual.value).toBe(elGenResultExpected.value);
      return;
    }
    assert(typeof elGenResultExpected.value === "object");
    assert("tag" in elGenResultExpected.value);

    const elActual = elGenResultActual.value;
    const elExpected = elGenResultExpected.value;
    expect(elActual.tag).toBe(elExpected.tag);
    expect(elActual.attributes).toStrictEqual(elExpected.attributes);

    const childrenGenActual = elActual.children;
    const childrenGenExpected = elExpected.children;

    let childrenGenResultActual = await childrenGenActual.next();
    let childrenGenResultExpected = await childrenGenExpected.next();
    expect(childrenGenResultActual.done).toBe(childrenGenResultActual.done);
    while (!childrenGenResultActual.done) {
      expect(typeof childrenGenResultActual.value).toBe(
        typeof childrenGenResultExpected.value
      );
      if (typeof childrenGenResultActual.value === "object") {
        await areIdenticalInSimulation(
          childrenGenResultActual.value,
          childrenGenResultExpected.value
        );
      } else {
        expect(childrenGenResultActual.value).toBe(
          childrenGenResultExpected.value
        );
      }
      childrenGenResultActual = await childrenGenActual.next();
      childrenGenResultExpected = await childrenGenExpected.next();
      expect(childrenGenResultActual.done).toBe(childrenGenResultActual.done);
    }
  }

  it("1 simple custom-component child", async function() {
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

    await areIdenticalInSimulation(actual, expected);
  });

  it("2 simple custom-component children", async function() {
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

    await areIdenticalInSimulation(actual, expected);
  });

  it("1 custom-component with yielding child", async function() {
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

    await areIdenticalInSimulation(actual, expected);
  });

  it("2 custom-component with yielding children", async function() {
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

    await areIdenticalInSimulation(actual, expected);
  });

  it("which returns custom-component", async function() {
    const actual = <ReturnsUserDefinedElement foo="a" />;

    const expected = <ReturnsSpanSimply foo="a" />;

    await areIdenticalInSimulation(actual, expected);
  });
});
