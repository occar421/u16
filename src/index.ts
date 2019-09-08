// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace u {
  export import JSX = JSXInternal;

  export import Component = Internal.Component;
}

export { isPrimitive } from "./utils";

import { _u } from "./u";

// export const u = _u;
export function* u(
  component: string | u.Component<{}>,
  attributesArg: { [key: string]: unknown }, // need to be able to be generator?
  ...childElements: Internal.ChildrenInJsx
): u.JSX.Element {
  // delegates only
  return yield* _u(component, attributesArg, ...childElements);
}

export { ignite } from "./ignite";
