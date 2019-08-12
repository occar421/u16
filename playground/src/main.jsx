/** @jsx u */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ignite, u } from "../../src";

ignite(
  <a title="b">
    <c className={/* yield */ Date.now().toString()}>foo-bar</c>
    <d>hoge-fuga</d>
  </a>,
  document.body
);
