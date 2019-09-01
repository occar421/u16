/** @jsx u */
import { u } from "../index";

describe("Intrinsic components", function() {
  describe("with simple usage", function() {
    it("simple one should wait once for the result", function() {
      const c = <div />;

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "div",
          attributes: {},
          children: []
        });
      }
    });

    it("1 arg one should wait once for the result", function() {
      const c = <div id="1" />;

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "div",
          attributes: { id: "1" },
          children: []
        });
      }
    });

    it("1 string child one should wait once for the result", function() {
      const c = <div id="1">buz</div>;

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "div",
          attributes: { id: "1" },
          children: ["buz"]
        });
      }
    });

    it("1 intrinsic child one should wait once for the result", function() {
      const c = (
        <div id="1">
          <div id="2" />
        </div>
      );

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "div",
          attributes: { id: "1" },
          children: [
            {
              tag: "div",
              attributes: { id: "2" },
              children: []
            }
          ]
        });
      }
    });

    it("2 intrinsic children one should wait once for the result", function() {
      const c = (
        <div id="1">
          <div id="2" />
          <div id="3" />
        </div>
      );

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "div",
          attributes: { id: "1" },
          children: [
            {
              tag: "div",
              attributes: { id: "2" },
              children: []
            },
            {
              tag: "div",
              attributes: { id: "3" },
              children: []
            }
          ]
        });
      }
    });
  });
});

function* ReturnsStringSimply({ foo }: { foo: string }): u.JSX.Element {
  return `~${foo}~`;
}
function* ReturnsSpanSimply({ foo }: { foo: string }): u.JSX.Element {
  return yield* <span>{foo}</span>;
}
function* ReturnsPreWith1Yield({ foo }: { foo: string }): u.JSX.Element {
  const [a] = yield ["bar"];
  return yield* <pre>{`${a}-${foo}`}</pre>;
}
function* ReturnsListsOrDivWithChildren({
  foo,
  children
}: {
  foo: string;
  children?: u.JSX.Element[];
}): u.JSX.Element {
  if (children && children.length > 0) {
    const results = [];
    for (const c of children) {
      results.push(yield* <li>{yield* c}</li>);
    }
    return yield* <ul>{results}</ul>;
  } else {
    return yield* <div>{foo}</div>;
  }
}

describe("User-defined components", function() {
  it("which returns string simply should wait once for the result", function() {
    const c = <ReturnsStringSimply foo="a" />;

    const result = c.next();
    expect(result.done).toBe(true);
    if (result.done) {
      expect(result.value).toBe("~a~");
    }
  });

  it("which returns element simply should wait twice for the result", function() {
    const c = <ReturnsSpanSimply foo="a" />;

    let result = c.next();
    expect(result.done).toBe(true);
    if (result.done) {
      expect(result.value).toStrictEqual({
        tag: "span",
        attributes: {},
        children: ["a"]
      });
    }
  });

  it("which returns element with one yield should wait twice for the result", function() {
    const c = <ReturnsPreWith1Yield foo="a" />;

    let result = c.next();
    expect(result.done).toBe(false);
    if (!result.done) {
      result = c.next([result.value]);
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "pre",
          attributes: {},
          children: ["bar-a"]
        });
      }
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
    if (result.done) {
      expect(result.value).toStrictEqual({
        tag: "ul",
        attributes: {},
        children: [
          [
            {
              tag: "li",
              attributes: {},
              children: ["~b~"]
            }
          ]
        ]
      });
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
    if (result.done) {
      expect(result.value).toStrictEqual({
        tag: "ul",
        attributes: {},
        children: [
          [
            {
              tag: "li",
              attributes: {},
              children: ["~b~"]
            },
            {
              tag: "li",
              attributes: {},
              children: ["~c~"]
            }
          ]
        ]
      });
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
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "ul",
          attributes: {},
          children: [
            [
              {
                tag: "li",
                attributes: {},
                children: [
                  {
                    tag: "pre",
                    attributes: {},
                    children: ["bar-b"]
                  }
                ]
              }
            ]
          ]
        });
      }
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
      if (!result.done) {
        result = c.next([result.value]);
        expect(result.done).toBe(true);
        if (result.done) {
          expect(result.value).toStrictEqual({
            tag: "ul",
            attributes: {},
            children: [
              [
                {
                  tag: "li",
                  attributes: {},
                  children: [
                    {
                      tag: "pre",
                      attributes: {},
                      children: ["bar-b"]
                    }
                  ]
                },
                {
                  tag: "li",
                  attributes: {},
                  children: [
                    {
                      tag: "pre",
                      attributes: {},
                      children: ["bar-c"]
                    }
                  ]
                }
              ]
            ]
          });
        }
      }
    }
  });
});
