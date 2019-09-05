import { isGenerator, normalizeGenerator } from "./utils";

export function* _u(
  component: string | Internal.Component<{}>,
  attributesArg: { [key: string]: unknown },
  ...childElements: (JSXInternal.Primitive | JSXInternal.Element)[]
): JSXInternal.Element {
  const attributes = attributesArg || {};
  if (typeof component === "function") {
    const content = component({
      ...attributes,
      children: childElements
    });
    if (isGenerator(content)) {
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
