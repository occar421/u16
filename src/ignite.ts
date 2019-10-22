import { u } from "./index";
import { isPrimitive } from "./utils";

async function testDomify(elGen: u.JSX.Element): Promise<Node> {
  let el: VirtualInternal.VNode;
  let value = undefined;
  while (true) {
    const resultPromise = elGen.next([value]); // to enable type inference...
    const childrenGenResult = await resultPromise;
    if (childrenGenResult.done) {
      el = childrenGenResult.value;
      break;
    }
    value = childrenGenResult.value;
  }

  if (isPrimitive(el)) {
    return document.createTextNode(elGen.toString());
  }

  const htmlElement = document.createElement(el.tag);

  const attributes = el.attributes;
  for (const key in attributes) {
    const value = attributes[key];
    if (isPrimitive(value)) {
      htmlElement.setAttribute(key, value.toString());
    } else if (!value) {
      // do nothing
    } else {
      console.warn("Not supported yet", value);
    }
  }

  const childrenGen = el.children;
  for await (const childElGen of childrenGen) {
    htmlElement.appendChild(
      isPrimitive(childElGen)
        ? document.createTextNode(childElGen.toString())
        : await testDomify(childElGen)
    );
  }
  return htmlElement;
}

export async function ignite(
  jsxElement: u.JSX.Element,
  htmlElement: HTMLElement
): Promise<void> {
  const inner = await testDomify(jsxElement);

  htmlElement.appendChild(inner);
}

// TODO function (event)
// TODO diffing to apply change using VDOM (state change commit by everlasting generator: consumer producer pattern with preemptive order commit)
// TODO event loop
