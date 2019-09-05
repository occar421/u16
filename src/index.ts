// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace u {
  export import JSX = JSXInternal;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Component<T extends {}> = ((
    props: T & { children?: (u.JSX.Primitive | u.JSX.Element)[] }
  ) => u.JSX.Element) & {
    name: string;
  };
}

function checkIfGenerator(
  arg: unknown
): arg is Generator<unknown, unknown, unknown> {
  // @ts-ignore
  return arg[Symbol.toStringTag] === "Generator";
}

export function isPrimitive(arg: unknown): arg is u.JSX.Primitive {
  return typeof arg === "string" || typeof arg === "number";
}

function* normalizeGenerator(
  childElements: (u.JSX.Primitive | u.JSX.Element)[]
): u.JSX.Children {
  for (const child of childElements) {
    if (checkIfGenerator(child)) {
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

export function* u(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: string | u.Component<{}>,
  attributesArg: { [key: string]: unknown }, // need to be able to be generator?
  ...childElements: (u.JSX.Primitive | u.JSX.Element)[]
): u.JSX.Element {
  const attributes = attributesArg || {};
  if (typeof component === "function") {
    const content = component({
      ...attributes,
      children: childElements
    });
    if (checkIfGenerator(content)) {
      return yield* content;
    } else {
      throw Error("Type of `component` is invalid.");
    }
  } else if (typeof component === "string") {
    return {
      tag: component,
      attributes,
      children: normalizeGenerator(childElements)
    };
  } else {
    throw Error("Type of `component` is invalid.");
  }
}

function testStringify(node: VNode): string {
  if (isPrimitive(node)) {
    return node.toString();
  } else {
    const children = node.children;
    const strings = [];
    let prev = undefined;
    while (true) {
      const current = children.next([prev]);
      if (!current.done) {
        strings.push(testStringify(current.value));
      } else {
        break;
      }
    }
    return `<${node.tag} ${Object.entries(node.attributes || {}).map(
      e => `${e[0]}="${e[1]}"`
    )}>${strings.join("")}</${node.tag}>`;
  }
}

export function ignite(
  jsxElement: u.JSX.Element,
  htmlElement: HTMLElement
): void {
  console.debug(jsxElement);
  let value;
  while (true) {
    const current = jsxElement.next(); // TODO construct element with child's VNode?
    console.debug(current);
    if (current.done) {
      value = testStringify(current.value);
      break;
    }
  }
  htmlElement.innerHTML = `<pre>${value}</pre>`; // TODO diffing to apply change

  // TODO event loop
}
