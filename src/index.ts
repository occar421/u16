// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace u {
  export import JSX = JSXInternal;

  export import Component = Internal.Component;
}

import { _u } from "./u";

export { map } from "./children-operators";

// export const u = _u;
export async function* u(
  component: string | u.Component<{}>,
  attributesArg: { [key: string]: unknown }, // need to be able to be generator?
  ...childElements: Internal.ChildrenInJsx[]
): u.JSX.Element {
  // delegates only
  return yield* _u(component, attributesArg, ...childElements);
}

export { ignite } from "./ignite";
