import { u } from "./index";

export function isGenerator(
  arg: unknown
): arg is Generator<unknown, unknown, unknown> {
  // @ts-ignore
  return arg[Symbol.toStringTag] === "Generator";
}

export function isPrimitive(arg: unknown): arg is u.JSX.Primitive {
  return typeof arg === "string" || typeof arg === "number";
}

// TODO tests and ensure it flattens gen<gen<T>>, gen<T[]>, gen<T>[], T[][]
export function* normalizeGenerator(
  childElements: (u.JSX.Primitive | u.JSX.Element)[]
): u.JSX.Children {
  for (const child of childElements) {
    if (isGenerator(child)) {
      while (true) {
        const current = child.next(); // do something here?
        if (current.done) {
          yield current.value;
          break;
        }
      }
    } else if (Array.isArray(child)) {
      yield* normalizeGenerator(child);
    } else {
      yield child;
    }
  }
  return;
}
