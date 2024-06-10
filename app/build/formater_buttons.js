import { isCursorAtEnd } from "./editor.js";
const code_btn = document.querySelector("#code_button");
const italic_btn = document.querySelector("#italic_button");
const bold_btn = document.querySelector("#bolder_button");
const textarea = document.querySelector("#content");
code_btn.addEventListener("click", HandleCodeButton);
function HandleCodeButton() {
  const textContent = String(textarea.textContent) ?? "";
  textarea.textContent = textContent + "\n\n" + "```javascript\n\n\n```";
  isCursorAtEnd(textarea);
  textarea.focus();
}