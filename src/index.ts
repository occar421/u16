// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace u {
  export import JSX = JSXInternal;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Component<T extends any[]> = ((...args: T) => u.JSX.Element) & {
    name: string;
  };
}

function checkIfGenerator(
  arg: unknown
): arg is Generator<unknown, unknown, unknown> {
  // @ts-ignore
  return arg[Symbol.toStringTag] === "Generator";
}

export function* u(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: string | u.Component<any[]>,
  attributesArg: { [key: string]: unknown }, // need to be able to be generator?
  ...childElements: u.JSX.Element[]
): u.JSX.Element {
  const name = typeof component === "string" ? component : component.name;
  console.debug(name, attributesArg);

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
    const children = [];
    for (let e of childElements) {
      if (checkIfGenerator(e)) {
        const result = yield* e;
        children.push(result);
      } else {
        children.push(e);
      }
    }
    return { tag: component, attributes, children };
  } else {
    throw Error("Type of `component` is invalid.");
  }
  // TODO normalize children tree
}

function testStringify(node: VNode): string {
  if (typeof node === "string") {
    return node;
  } else {
    return `<${node.tag} ${Object.entries(node.attributes || {}).map(
      e => `${e[0]}="${e[1]}"`
    )}>${(node.children || []).map(c => testStringify(c)).join("")}</${
      node.tag
    }>`;
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
