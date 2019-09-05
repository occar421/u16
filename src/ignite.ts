import { isPrimitive, u } from "./index";

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
