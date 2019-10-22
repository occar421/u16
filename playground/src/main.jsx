/** @jsx u */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ignite, u, map } from "../../src";

function formatDate(date) {
  let formatStr = "YYYY-MM-DD hh:mm:ss.ttt";
  formatStr = formatStr.replace(/YYYY/g, date.getFullYear());
  formatStr = formatStr.replace(/MM/g, date.getMonth());
  formatStr = formatStr.replace(/DD/g, date.getDate());
  formatStr = formatStr.replace(/hh/g, date.getHours());
  formatStr = formatStr.replace(/mm/g, date.getMinutes());
  formatStr = formatStr.replace(/ss/g, date.getSeconds());
  formatStr = formatStr.replace(/ttt/g, date.getMilliseconds());
  return formatStr;
}

async function* App(props) {
  return yield* (
    <div>
      <span>{formatDate(new Date())}</span>
      <a href="http://example.com/">hoge-fuga</a>
      <span>{map(([c]) => c)(props.children)}</span>
    </div>
  );
}

async function* Component() {
  return yield* <b>y</b>;
}

ignite(
  <App>
    <Component />
  </App>,
  document.body
);
