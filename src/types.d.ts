// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeepArray<T> extends Array<T | DeepArray<T>> {}

declare namespace Internal {
  type Primitive = string | number;

  type Children = Generator<
    VNode,
    undefined /* TODO */,
    SomethingValueAndOperationParameter /* TODO change */
  >;

  type ChildrenInJsx = DeepArray<JSXInternal.Primitive | JSXInternal.Element>;

  type Component<T extends {}> = ((
    props: T & { children?: ChildrenInJsx }
  ) => JSXInternal.Element) & {
    name: string;
  };
}

type SomethingValueAndMetrics = [unknown]; // TODO
type SomethingValueAndOperationParameter = [unknown]; // TODO
type VNode =
  | {
      tag: string;
      attributes: { [key: string]: unknown };
      children: Internal.Children;
    }
  | Internal.Primitive;

interface HtmlCommon {
  id?: string;
  children?: Internal.Primitive | Element[];
}

declare namespace JSXInternal {
  type Element = Generator<
    SomethingValueAndMetrics,
    VNode,
    SomethingValueAndOperationParameter
  >; // TODO internal path to return generated HTML element?

  interface IntrinsicElements {
    div: HtmlCommon;
    span: HtmlCommon;
    ul: HtmlCommon;
    li: HtmlCommon;
    pre: HtmlCommon;
  }

  type Primitive = Internal.Primitive;
  type Children = Internal.Children;
}
