const textarea = document.querySelector("#content");
const link = document.querySelector("#link");
const export_button = document.querySelector("#export_button");
const bold_button = document.querySelector("#bold_button");
const italic_button = document.querySelector("#italic_button");
const list_button = document.querySelector("#list_button");
const code_button = document.querySelector("#code_button");
import { Formater } from "./convert.js";
export let content;
bold_button.addEventListener("click", () => {
    textarea.innerText = textarea.innerText + '**text**';
});
italic_button.addEventListener('click', () => {
    textarea.innerText = textarea.innerText + '__text__';
});
code_button.addEventListener('click', () => {
    textarea.innerText = textarea.innerText + '\n```js\n```';
});
list_button.addEventListener('click', () => {
    textarea.innerText = textarea.innerText + '\n-';
});
textarea.addEventListener("input", (event) => {
    const targetElement = event.target;
    content = String(targetElement.textContent);
});
textarea.addEventListener('blur', handleBlur);
textarea.addEventListener('focus', handleFocus);
textarea.addEventListener('keydown', HandleEditorElements);
function HandleEditorElements(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const newElement = document.createElement('div');
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            newElement.className = 'text_area_darkmode';
        }
        else {
            newElement.className = 'text_area';
        }
        newElement.contentEditable = 'true';
        newElement.addEventListener('keydown', HandleEditorElements);
        newElement.innerHTML = '';
        e.target.insertAdjacentElement('afterend', newElement);
        newElement.focus();
    }
}
function handleFocus(event) {
    const div = event.target;
    if (div.textContent.trim() === '') {
        div.classList.remove('placeholder');
    }
}
function handleBlur(event) {
    const div = event.target;
    if (div.textContent.trim() === '') {
        div.classList.add('placeholder');
    }
}
function ExportFile(markdown) {
    let blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    let url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "document.md";
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 100);
}
export_button.addEventListener("click", () => {
    ExportFile(Formater());
});
//# sourceMappingURL=export.js.map