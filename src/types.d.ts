declare namespace Internal {
  type Primitive = string | number;

  type ChildrenInJsx =
    | ChildrenInJsx[]
    | GeneratorOfChildrenInJsx
    | JSXInternal.Primitive
    | JSXInternal.Element;
  type GeneratorOfChildrenInJsx = {
    childrenGenerator: AsyncGenerator<ChildrenInJsx>;
  };

  interface Component<T extends {} = {}> {
    (props: T & { children?: VirtualInternal.VChildren }): JSXInternal.Element;
    name: string;
  }
}

type SomethingValueAndMetrics = [unknown]; // TODO
type SomethingValueAndOperationParameter = [unknown]; // TODO

interface HtmlCommon {
  id?: string;
  children?: Internal.Primitive | Element[];
}

declare namespace VirtualInternal {
  interface VElementNode {
    tag: string;
    attributes: { [key: string]: unknown };
    children: VChildren;
  }
  type VNode = VElementNode | Internal.Primitive;
  type VChildren = AsyncGenerator<JSXInternal.Element | JSXInternal.Primitive>;
}

declare namespace JSXInternal {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Element
    extends AsyncGenerator<
      SomethingValueAndMetrics,
      VirtualInternal.VNode,
      SomethingValueAndOperationParameter
    > {} // TODO internal path to return generated HTML element?

  interface IntrinsicElements {
    div: HtmlCommon;
    span: HtmlCommon;
    ul: HtmlCommon;
    li: HtmlCommon;
    pre: HtmlCommon;
  }

  type Primitive = Internal.Primitive;
  type Children = VirtualInternal.VChildren;
}
