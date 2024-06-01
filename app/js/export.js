const link = document.querySelector("#link");
const export_button = document.querySelector("#export_button");
const bold_button = document.querySelector("#bold_button");
const italic_button = document.querySelector("#italic_button");
const list_button = document.querySelector("#list_button");
const code_button = document.querySelector("#code_button");
import { Formater } from "./convert.js";
import { ClearContentElement } from "./editor.js";
let elementFocus = null;
function handleConvertElementsInDiv() {
    const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
    elementsWithContentEditable.forEach((item) => {
        if (item.classList.contains("selected")) {
            elementFocus = item;
        }
        else {
            console.log("nenhum elemento focado");
        }
    });
}
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
bold_button.addEventListener("click", () => {
    handleConvertElementsInDiv();
    if (elementFocus) {
        elementFocus.innerHTML = elementFocus.innerHTML + "**text**";
    }
    else {
        console.log("elemento é nulo!");
    }
});
italic_button.addEventListener("click", () => {
    handleConvertElementsInDiv();
    if (elementFocus) {
        elementFocus.innerHTML = elementFocus.innerHTML + "__text__";
    }
    else {
        console.log("elemento é nulo!");
    }
});
list_button.addEventListener("click", () => {
    handleConvertElementsInDiv();
    if (elementFocus) {
        elementFocus.innerHTML = elementFocus.innerHTML + "\n-";
    }
    else {
        console.log("elemento é nulo!");
    }
});
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