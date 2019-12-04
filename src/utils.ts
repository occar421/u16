// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isGenerator(
  arg: unknown
): arg is Generator<unknown, unknown, unknown> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return typeof arg === "object" && arg[Symbol.toStringTag] === "Generator";
}

export function isAsyncGenerator(
  arg: unknown
): arg is AsyncGenerator<unknown, unknown, unknown> {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    typeof arg === "object" && typeof arg[Symbol.asyncIterator] === "function"
  );
}

export function isPrimitive(arg: unknown): arg is JSXInternal.Primitive {
  return typeof arg === "string" || typeof arg === "number";
}

export async function* flattenChildren(
  childElements: Internal.ChildrenInJsx
): JSXInternal.Children {
  if (Array.isArray(childElements)) {
    for (const child of childElements) {
      yield* flattenChildren(child);
    }
  } else if (
    typeof childElements === "object" &&
    "childrenGenerator" in childElements
  ) {
    for await (const child of childElements.childrenGenerator) {
      yield* flattenChildren(child);
    }
  } else {
    yield childElements;
  }
}
