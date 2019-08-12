import { upgradeElement } from "./dist/@ampproject/worker-dom/dist/main.mjs";

upgradeElement(
  document.getElementById("root"),
  "./dist/@ampproject/worker-dom/dist/worker/worker.mjs"
);
