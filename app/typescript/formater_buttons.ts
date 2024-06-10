import { isCursorAtEnd } from "./editor.js";

type btn_type = HTMLButtonElement;
type element_type = HTMLDivElement;

const code_btn = document.querySelector("#code_button") as btn_type;
const italic_btn = document.querySelector("#italic_button") as btn_type;
const bold_btn = document.querySelector("#bolder_button") as btn_type;
const textarea = document.querySelector("#content") as element_type;

code_btn.addEventListener("click", HandleCodeButton);

function HandleCodeButton() {
    const textContent = String(textarea.textContent) ?? "";

    textarea.textContent = textContent + '\n\n' + '```javascript\n\n\n```';
    isCursorAtEnd(textarea);
    textarea.focus();
};
