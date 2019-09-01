declare namespace Internal {
  type Primitive = string | number;

  type Children = Generator<
    VNode,
    undefined /* TODO */,
    SomethingValueAndOperationParameter /* TODO change */
  >;
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
