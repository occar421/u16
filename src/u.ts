import { isAsyncGenerator, flattenChildren } from "./utils";

export async function* _u(
  component: string | Internal.Component<{}>,
  attributesArg: { [key: string]: unknown },
  ...childElements: Internal.ChildrenInJsx[]
): JSXInternal.Element {
  const attributes = attributesArg || {};
  if (typeof component === "function") {
    const content = component({
      ...attributes,
      children: flattenChildren(childElements)
    });
    if (isAsyncGenerator(content)) {
      return yield* content;
    } else {
      throw Error("Type of `component` is invalid.");
    }
  } else if (typeof component === "string") {
    return {
      tag: component,
      attributes,
      children: flattenChildren(childElements)
    };
  } else {
    throw Error("Type of `component` is invalid.");
  }
}
