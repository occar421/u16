# u16

u16 (<b>u</b>nder __sixteen__) is an experimental view library to realize 60fps(under 16ms to render) utilizes TSX and generator.  
This is sandbox phase and everything is subject to change.

## Plan

- _Async_ generator based view library (everything) `yield` and `return`
- Only supports TypeScript 3.7+
- no IE11
- Estimate time in render func queue

```ts
const App: Component<{ foo: string }> = function*({ foo }) {
  const [calc] = yield [{ a: 1, b: 2 }];
  // yield u16.beGone(); // can't go back anymore
  const [bar] = yield [foo + 1];
  const [buz] = yield [Promise.resolve("a")];
  // yield u16.markDownstreamSync();
  const date = Date.now(); // sync
  return yield* (
    <div>
      {calc.a}
      {date}
      {calc.b}
      {bar}
      {buz}
    </div>
  );
};
```
