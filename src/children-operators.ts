// <ul>{children |> map(([c]) => <li>{c}</li>)}</ul>
export function map(
  project: (
    value: [
      JSXInternal.Element | JSXInternal.Primitive
    ] /* [value, op]: [VNode, TODO]*/,
    index: number
  ) => Internal.ChildrenInJsx
): (g: VirtualInternal.VChildren) => Internal.GeneratorOfChildrenInJsx {
  return (g: VirtualInternal.VChildren) => ({
    childrenGenerator: (async function*(): AsyncGenerator<
      Internal.ChildrenInJsx
    > {
      let value = undefined;
      let index = 0;
      while (true) {
        const currentPromise = g.next([value]); // to enable type inference...
        const current = await currentPromise;
        if (current.done) {
          break;
        }
        value = current.value;
        yield project([value], index);
        index++;
      }
    })()
  });
}
