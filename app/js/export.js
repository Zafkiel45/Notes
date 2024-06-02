const link = document.querySelector("#link");
const export_button = document.querySelector("#export_button");
import { Formater } from "./convert.js";
import { ClearContentElement } from "./editor.js";
export function handleSelectionElement(e) {
    const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
    const div = e.target;
    elementsWithContentEditable.forEach((item) => {
        if (item.classList.contains("selected")) {
            item.classList.remove("selected");
        }
    });
    div.classList.add("selected");
}
function ExportFile(markdown) {
    let blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8",
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
    ExportFile(Formater());
});
//# sourceMappingURL=export.js.map