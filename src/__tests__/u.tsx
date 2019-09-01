/** @jsx u */
import { u as uOriginal } from "../index";

// > for test
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace u.JSX {
  export import Element = uOriginal.JSX.Element;
  // noinspection JSUnusedGlobalSymbols
  interface IntrinsicElements {
    foo: {
      bar?: number;
    };
    fake: {
      [key: string]: unknown;
    };
  }
}
// @ts-ignore
// noinspection JSUnusedLocalSymbols
const u = uOriginal;
// < for test

describe("Intrinsic components", function() {
  describe("with simple usage", function() {
    it("simple one should wait once for the result", function() {
      const c = <foo />;

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "foo",
          attributes: {},
          children: []
        });
      }
    });

    it("1 arg one should wait once for the result", function() {
      const c = <foo bar={1} />;

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "foo",
          attributes: { bar: 1 },
          children: []
        });
      }
    });

    it("1 string child one should wait once for the result", function() {
      const c = <foo bar={1}>buz</foo>;

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "foo",
          attributes: { bar: 1 },
          children: ["buz"]
        });
      }
    });

    it("1 intrinsic child one should wait once for the result", function() {
      const c = (
        <foo bar={1}>
          <foo bar={2} />
        </foo>
      );

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "foo",
          attributes: { bar: 1 },
          children: [
            {
              tag: "foo",
              attributes: { bar: 2 },
              children: []
            }
          ]
        });
      }
    });

    it("2 intrinsic children one should wait once for the result", function() {
      const c = (
        <foo bar={1}>
          <foo bar={2} />
          <foo bar={3} />
        </foo>
      );

      const result = c.next();
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "foo",
          attributes: { bar: 1 },
          children: [
            {
              tag: "foo",
              attributes: { bar: 2 },
              children: []
            },
            {
              tag: "foo",
              attributes: { bar: 3 },
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
function* ReturnsElementSimply({ foo }: { foo: string }): u.JSX.Element {
  return yield* <fake>{foo}</fake>;
}
function* ReturnsElementWith1Yield({ foo }: { foo: string }): u.JSX.Element {
  const [a] = yield ["bar"];
  return yield* <fake>{`${a}-${foo}`}</fake>;
}
function* ReturnsElementWithChildren({
  foo,
  children
}: {
  foo: string;
  children?: u.JSX.Element[];
}): u.JSX.Element {
  if (children && children.length > 0) {
    const results = [];
    for (const c of children) {
      results.push(yield* <fake className="sub">{yield* c}</fake>);
    }
    return yield* <fake className="root">{results}</fake>;
  } else {
    return yield* <fake className="root">{foo}</fake>;
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
    const c = <ReturnsElementSimply foo="a" />;

    let result = c.next();
    expect(result.done).toBe(true);
    if (result.done) {
      expect(result.value).toStrictEqual({
        tag: "fake",
        attributes: {},
        children: ["a"]
      });
    }
  });

  it("which returns element with one yield should wait twice for the result", function() {
    const c = <ReturnsElementWith1Yield foo="a" />;

    let result = c.next();
    expect(result.done).toBe(false);
    if (!result.done) {
      expect(result.value).toStrictEqual(["bar"]);
      result = c.next([result.value]);
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "fake",
          attributes: {},
          children: ["bar-a"]
        });
      }
    }
  });

  it("1 simple custom-component child one should wait once for the result", function() {
    const c = (
      <ReturnsElementWithChildren foo="a">
        <ReturnsStringSimply foo="b" />
      </ReturnsElementWithChildren>
    );

    const result = c.next();
    expect(result.done).toBe(true);
    if (result.done) {
      expect(result.value).toStrictEqual({
        tag: "fake",
        attributes: { className: "root" },
        children: [
          [
            {
              tag: "fake",
              attributes: { className: "sub" },
              children: ["~b~"]
            }
          ]
        ]
      });
    }
  });

  it("2 simple custom-component child one should wait once for the result", function() {
    const c = (
      <ReturnsElementWithChildren foo="a">
        <ReturnsStringSimply foo="b" />
        <ReturnsStringSimply foo="c" />
      </ReturnsElementWithChildren>
    );

    const result = c.next();
    expect(result.done).toBe(true);
    if (result.done) {
      expect(result.value).toStrictEqual({
        tag: "fake",
        attributes: { className: "root" },
        children: [
          [
            {
              tag: "fake",
              attributes: { className: "sub" },
              children: ["~b~"]
            },
            {
              tag: "fake",
              attributes: { className: "sub" },
              children: ["~c~"]
            }
          ]
        ]
      });
    }
  });

  it("1 custom-component with yield child one should wait twice for the result", function() {
    const c = (
      <ReturnsElementWithChildren foo="a">
        <ReturnsElementWith1Yield foo="b" />
      </ReturnsElementWithChildren>
    );

    let result = c.next();
    expect(result.done).toBe(false);
    if (!result.done) {
      result = c.next([result.value]);
      expect(result.done).toBe(true);
      if (result.done) {
        expect(result.value).toStrictEqual({
          tag: "fake",
          attributes: { className: "root" },
          children: [
            [
              {
                tag: "fake",
                attributes: { className: "sub" },
                children: [
                  {
                    tag: "fake",
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
      <ReturnsElementWithChildren foo="a">
        <ReturnsElementWith1Yield foo="b" />
        <ReturnsElementWith1Yield foo="c" />
      </ReturnsElementWithChildren>
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
            tag: "fake",
            attributes: { className: "root" },
            children: [
              [
                {
                  tag: "fake",
                  attributes: { className: "sub" },
                  children: [
                    {
                      tag: "fake",
                      attributes: {},
                      children: ["bar-b"]
                    }
                  ]
                },
                {
                  tag: "fake",
                  attributes: { className: "sub" },
                  children: [
                    {
                      tag: "fake",
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
