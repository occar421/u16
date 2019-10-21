import { u } from "./index";
import { isPrimitive } from "./utils";

async function testStringify(elGen: u.JSX.Element): Promise<string> {
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
    return elGen.toString();
  }

  const childrenGen = el.children;
  const strings: string[] = [];
  for (const childElGen of childrenGen) {
    if (isPrimitive(childElGen)) {
      strings.push(childElGen.toString());
    } else {
      strings.push(await testStringify(childElGen));
    }
  }
  return `<${el.tag} ${Object.entries(el.attributes || {}).map(
    e => `${e[0]}="${e[1]}"`
  )}>${strings.join("")}</${el.tag}>`;
}

export async function ignite(
  jsxElement: u.JSX.Element,
  htmlElement: HTMLElement
): Promise<void> {
  console.debug(jsxElement);

  const inner = await testStringify(jsxElement);

  htmlElement.innerHTML = `<pre>${inner}</pre>`; // TODO diffing to apply change

  // TODO event loop
}
