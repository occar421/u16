/** @jsx u */
import { isPrimitive, u } from "../../index";

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
  if (children && children.length > 0) {
    const results: u.JSX.Element[] = [];
    for (const c of children) {
      if (isPrimitive(c)) {
        results.push(<li>{yield [c]}</li>);
      } else if (Array.isArray(c)) {
        // results.push(<li></li>);
        // FIXME: ignore case in UnitTest
      } else {
        results.push(<li>{yield* c}</li>);
      }
    }
    return yield* <ul>{results}</ul>;
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
  it("which returns string simply should wait once for the result", function() {
    const c = <ReturnsStringSimply foo="a" />;

    const result = c.next();
    expect(result.done).toBe(true);
    if (result.done) {
      expect(result.value).toBe("~a~");
    } else {
      throw new Error("failed");
    }
  });

  it("which returns element simply should wait twice for the result", function() {
    const c = <ReturnsSpanSimply foo="a" />;

    const result = c.next();
    expect(result.done).toBe(true);
    if (result.done && typeof result.value === "object") {
      expect(result.value.tag).toBe("span");
      expect(result.value.attributes).toStrictEqual({});
      let child = result.value.children.next();
      expect(child.done).toBe(false);
      expect(child.value).toStrictEqual({ node: "a" });
      child = result.value.children.next();
      expect(child.done).toBe(true);
    } else {
      throw new Error("failed");
    }
  });

  it("which returns element with one yield should wait twice for the result", function() {
    const c = <ReturnsPreWith1Yield foo="a" />;

    let result = c.next();
    expect(result.done).toBe(false);
    if (!result.done) {
      result = c.next([result.value]);
      expect(result.done).toBe(true);
      if (result.done && typeof result.value === "object") {
        expect(result.value.tag).toBe("pre");
        expect(result.value.attributes).toStrictEqual({});
        let child = result.value.children.next();
        expect(child.done).toBe(false);
        expect(child.value).toStrictEqual({ node: "bar-a" });
        child = result.value.children.next();
        expect(child.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    } else {
      throw new Error("failed");
    }
  });

  it("1 simple custom-component child one should wait once for the result", function() {
    const c = (
      <ReturnsListsOrDivWithChildren foo="a">
        <ReturnsStringSimply foo="b" />
      </ReturnsListsOrDivWithChildren>
    );

    const result = c.next();
    expect(result.done).toBe(true);
    if (result.done && typeof result.value === "object") {
      expect(result.value.tag).toBe("ul");
      expect(result.value.attributes).toStrictEqual({});
      let child = result.value.children.next();
      expect(child.done).toBe(false);
      if (
        !child.done &&
        "node" in child.value &&
        typeof child.value.node === "object"
      ) {
        const node = child.value.node;
        expect(node.tag).toBe("li");
        expect(node.attributes).toStrictEqual({});
        let grandchild = node.children.next();
        expect(grandchild.done).toBe(false);
        expect(grandchild.value).toStrictEqual({ node: "~b~" });
        grandchild = node.children.next();
        expect(grandchild.done).toBe(true);
      } else {
        throw new Error("failed");
      }
      child = result.value.children.next();
      expect(child.done).toBe(true);
    } else {
      throw new Error("failed");
    }
  });

  it("2 simple custom-component child one should wait once for the result", function() {
    const c = (
      <ReturnsListsOrDivWithChildren foo="a">
        <ReturnsStringSimply foo="b" />
        <ReturnsStringSimply foo="c" />
      </ReturnsListsOrDivWithChildren>
    );

    const result = c.next();
    expect(result.done).toBe(true);
    if (result.done && typeof result.value === "object") {
      expect(result.value.tag).toBe("ul");
      expect(result.value.attributes).toStrictEqual({});
      let child = result.value.children.next();
      expect(child.done).toBe(false);
      if (
        !child.done &&
        "node" in child.value &&
        typeof child.value.node === "object"
      ) {
        const node = child.value.node;
        expect(node.tag).toBe("li");
        expect(node.attributes).toStrictEqual({});
        let grandchild = node.children.next();
        expect(grandchild.done).toBe(false);
        expect(grandchild.value).toStrictEqual({ node: "~b~" });
        grandchild = node.children.next();
        expect(grandchild.done).toBe(true);
      } else {
        throw new Error("failed");
      }
      child = result.value.children.next();
      expect(child.done).toBe(false);
      if (
        !child.done &&
        "node" in child.value &&
        typeof child.value.node === "object"
      ) {
        const node = child.value.node;
        expect(node.tag).toBe("li");
        expect(node.attributes).toStrictEqual({});
        let grandchild = node.children.next();
        expect(grandchild.done).toBe(false);
        expect(grandchild.value).toStrictEqual({ node: "~c~" });
        grandchild = node.children.next();
        expect(grandchild.done).toBe(true);
      } else {
        throw new Error("failed");
      }
      child = result.value.children.next();
      expect(child.done).toBe(true);
    } else {
      throw new Error("failed");
    }
  });

  it("1 custom-component with yield child one should wait twice for the result", function() {
    const c = (
      <ReturnsListsOrDivWithChildren foo="a">
        <ReturnsPreWith1Yield foo="b" />
      </ReturnsListsOrDivWithChildren>
    );

    let result = c.next();
    expect(result.done).toBe(false);
    if (!result.done) {
      result = c.next([result.value]);
      expect(result.done).toBe(true);
      if (result.done && typeof result.value === "object") {
        expect(result.value.tag).toBe("ul");
        expect(result.value.attributes).toStrictEqual({});
        let child = result.value.children.next();
        expect(child.done).toBe(false);
        if (
          !child.done &&
          "node" in child.value &&
          typeof child.value.node === "object"
        ) {
          const node = child.value.node;
          expect(node.tag).toBe("li");
          expect(node.attributes).toStrictEqual({});
          let grandchild = node.children.next();
          expect(grandchild.done).toBe(false);
          if (
            !grandchild.done &&
            "node" in grandchild.value &&
            typeof grandchild.value.node === "object"
          ) {
            const node = grandchild.value.node;
            expect(node.tag).toBe("pre");
            expect(node.attributes).toStrictEqual({});
            let greatGrandchild = node.children.next();
            expect(greatGrandchild.done).toBe(false);
            expect(greatGrandchild.value).toStrictEqual({ node: "bar-b" });
            greatGrandchild = node.children.next();
            expect(greatGrandchild.done).toBe(true);
          } else {
            throw new Error("failed");
          }
          grandchild = node.children.next();
          expect(grandchild.done).toBe(true);
        } else {
          throw new Error("failed");
        }
        child = result.value.children.next();
        expect(child.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    } else {
      throw new Error("failed");
    }
  });

  it("2 custom-component with yield child one should wait twice for the result", function() {
    const c = (
      <ReturnsListsOrDivWithChildren foo="a">
        <ReturnsPreWith1Yield foo="b" />
        <ReturnsPreWith1Yield foo="c" />
      </ReturnsListsOrDivWithChildren>
    );

    let result = c.next();
    expect(result.done).toBe(false);
    if (!result.done) {
      result = c.next([result.value]);
      expect(result.done).toBe(false);
      result = c.next([result.value]);
      expect(result.done).toBe(true);
      if (result.done && typeof result.value === "object") {
        expect(result.value.tag).toBe("ul");
        expect(result.value.attributes).toStrictEqual({});
        let child = result.value.children.next();
        expect(child.done).toBe(false);
        if (
          !child.done &&
          "node" in child.value &&
          typeof child.value.node === "object"
        ) {
          const node = child.value.node;
          expect(node.tag).toBe("li");
          expect(node.attributes).toStrictEqual({});
          let grandchild = node.children.next();
          expect(grandchild.done).toBe(false);
          if (
            !grandchild.done &&
            "node" in grandchild.value &&
            typeof grandchild.value.node === "object"
          ) {
            const node = grandchild.value.node;
            expect(node.tag).toBe("pre");
            expect(node.attributes).toStrictEqual({});
            let grandgrandchild = node.children.next();
            expect(grandgrandchild.done).toBe(false);
            expect(grandgrandchild.value).toStrictEqual({ node: "bar-b" });
            grandgrandchild = node.children.next();
            expect(grandgrandchild.done).toBe(true);
          } else {
            throw new Error("failed");
          }
          grandchild = node.children.next();
          expect(grandchild.done).toBe(true);
        } else {
          throw new Error("failed");
        }
        child = result.value.children.next();
        expect(child.done).toBe(false);
        if (
          !child.done &&
          "node" in child.value &&
          typeof child.value.node === "object"
        ) {
          const node = child.value.node;
          expect(node.tag).toBe("li");
          expect(node.attributes).toStrictEqual({});
          let grandchild = node.children.next();
          expect(grandchild.done).toBe(false);
          if (
            !grandchild.done &&
            "node" in grandchild.value &&
            typeof grandchild.value.node === "object"
          ) {
            const node = grandchild.value.node;
            expect(node.tag).toBe("pre");
            expect(node.attributes).toStrictEqual({});
            let greatGrandchild = node.children.next();
            expect(greatGrandchild.done).toBe(false);
            expect(greatGrandchild.value).toStrictEqual({ node: "bar-c" });
            greatGrandchild = node.children.next();
            expect(greatGrandchild.done).toBe(true);
          } else {
            throw new Error("failed");
          }
          grandchild = node.children.next();
          expect(grandchild.done).toBe(true);
        } else {
          throw new Error("failed");
        }
        child = result.value.children.next();
        expect(child.done).toBe(true);
      } else {
        throw new Error("failed");
      }
    } else {
      throw new Error("failed");
    }
  });

  it("which returns custom-component should behave like the content", function() {
    const c = <ReturnsUserDefinedElement foo="a" />;

    const result = c.next();
    expect(result.done).toBe(true);
    if (result.done && typeof result.value === "object") {
      expect(result.value.tag).toBe("span");
      expect(result.value.attributes).toStrictEqual({});
      let child = result.value.children.next();
      expect(child.done).toBe(false);
      expect(child.value).toStrictEqual({ node: "a" });
      child = result.value.children.next();
      expect(child.done).toBe(true);
    } else {
      throw new Error("failed");
    }
  });
});
