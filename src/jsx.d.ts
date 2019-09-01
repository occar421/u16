type SomethingValueAndMetrics = [unknown]; // TODO
type SomethingValueAndOperationParameter = [unknown]; // TODO
type VNode =
  | {
      tag: string;
      attributes: { [key: string]: unknown };
      children: VNode[]; // TODO change to Generator<VNode, undefined, T>?
    }
  | string;

interface HtmlCommon {
  id?: string;
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
}
