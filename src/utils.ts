export function isGenerator(
  arg: unknown
): arg is Generator<unknown, unknown, unknown> {
  // @ts-ignore
  return arg[Symbol.toStringTag] === "Generator";
}

export function isPrimitive(arg: unknown): arg is JSXInternal.Primitive {
  return typeof arg === "string" || typeof arg === "number";
}

export function* flattenChildren(
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
    for (const child of childElements.childrenGenerator) {
      yield* flattenChildren(child);
    }
  } else {
    yield childElements;
  }
}
