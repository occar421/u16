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

export function* normalizeGenerator(
  childElements: Internal.ChildrenInJsx
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

// TODO? util map function for:
//     for (const c of children) {
//       if (isPrimitive(c)) {
//         results.push(<li>{yield [c]}</li>);
//       } else if (Array.isArray(c)) {
//         results.push(<li>???</li>);
//       } else {
//         results.push(<li>{yield* c}</li>);
//       }
//     }
//  to:
//  children |> map(?, function* (c) { return <li>{yield [c]}</li>; });
//  other than normalizeGenerator
