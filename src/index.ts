// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace u16 {
  export import JSX = JSXInternal;
}

export function u(): u16.JSX.Element {
  console.log(arguments);
  return arguments[0]; // TODO
}

export function ignite(
  jsxElement: u16.JSX.Element,
  htmlElement: HTMLElement
): void {
  console.log(htmlElement);
  htmlElement.textContent = jsxElement; // TODO
}
