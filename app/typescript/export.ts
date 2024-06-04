const link = document.querySelector("#link") as HTMLAnchorElement;
const export_button = document.querySelector(
  "#export_button",
) as HTMLButtonElement;

import { ClearContentElement } from "./editor.js";
import { HandleElementContent } from "./editor.js";

// export
function ExportFile(markdown: string): void {
  let blob: Blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8",
  });
  let url: string = URL.createObjectURL(blob);

  link.href = url;
  link.download = "document.md";
  ClearContentElement();

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}

export_button.addEventListener("click", () => {
  ExportFile(String(HandleElementContent()));
});
