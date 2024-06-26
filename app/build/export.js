const link = document.querySelector("#link");
const export_button = document.querySelector("#export_button");
import { ClearContentElement } from "./editor.js";
import { HandleContentInEditor } from "./editor.js";
function ExportFile(markdown) {
  let blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8"
  });
  let url = URL.createObjectURL(blob);
  link.href = url;
  link.download = "document.md";
  ClearContentElement();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}
export_button.addEventListener("click", () => {
  ExportFile(HandleContentInEditor());
});