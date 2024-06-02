const link = document.querySelector("#link") as HTMLAnchorElement;
const export_button = document.querySelector(
  "#export_button"
) as HTMLButtonElement;

import { Formater } from "./convert.js";
import { ClearContentElement } from "./editor.js";

export function handleSelectionElement(e: Event) {
  const elementsWithContentEditable = document.querySelectorAll<HTMLDivElement>(
    "div[contenteditable]"
  );
  const div = e.target as HTMLDivElement;

  elementsWithContentEditable.forEach((item) => {
    if (item.classList.contains("selected")) {
      item.classList.remove("selected");
    }
  });

  div.classList.add("selected");
}

// export
function ExportFile(markdown: string): void {
  let blob: Blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8",
  });
  let url: string = URL.createObjectURL(blob);

  link.href = url;
  link.download = "document.md";
  ClearContentElement()
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}

export_button.addEventListener("click", () => {
  ExportFile(Formater());
});
