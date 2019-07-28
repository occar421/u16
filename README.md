# u16
Experimental view library to realize 60fps(under 16ms to render) utilizes TypeScript and generator.

Plan

* Generator based view library (everything) `yield` and `return`
* Only supports TypeScript 3.6+
* no IE11
* Estimate time in render func queue

```ts
function* App({ foo }) {
  const calc = yield { a: 1, b: 2 };
  yield U16.beGone(); // can't go back anymore
  const bar = yield (foo + 1);
  yield U16.markDownstreamSync();
  const date = Date.now(); // sync
  return <div>{calc.a}{date}{calc.b}{bar}</div>;
}
```
