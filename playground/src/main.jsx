/** @jsx u */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ignite, u } from "../../src";

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

function App() {
  return (
    <a title="b">
      <c className={/* yield */ formatDate(new Date())}>foo-bar</c>
      <d>hoge-fuga</d>
    </a>
  );
}

function Component() {
  return <z>y</z>;
}

ignite(
  <App>
    <Component />
  </App>,
  document.body
);
