import { DeleteElement, HandleEditorElements, handleClearPaste } from "./editor.js";
const bold_btn = document.querySelector("#bold_button");
const italic_btn = document.querySelector("#italic_button");
const list_btn = document.querySelector("#list_button");
const code_btn = document.querySelector("#code_button");
const table_btn = document.querySelector("#table_button");
const main = document.querySelector('#container_main');
code_btn.addEventListener("click", () => {
    const NewPre = document.createElement('pre');
    const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
    let TargetElement;
    NewPre.className = 'code_block editable';
    NewPre.contentEditable = 'true';
    NewPre.textContent = '```javascript\n\n\n```';
    NewPre.spellcheck = false;
    NewPre.addEventListener('keydown', HandleEditorElements);
    NewPre.addEventListener('keydown', DeleteElement);
    elementsWithContentEditable.forEach((item) => {
        if (item.classList.contains('selected')) {
            TargetElement = item;
            TargetElement.insertAdjacentElement("afterend", NewPre);
            NewPre.focus();
        }
    });
});
table_btn.addEventListener('click', () => {
    const NewDiv = document.createElement('div');
    const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
    NewDiv.className = 'table editable';
    NewDiv.contentEditable = 'true';
    NewDiv.textContent = `| Header 1 | Header 2 |
  | -------- | -------- |
  | Item 1   | item 2   |
  `;
    let TargetElement;
    NewDiv.addEventListener('keydown', HandleEditorElements);
    NewDiv.addEventListener('keydown', DeleteElement);
    NewDiv.addEventListener('paste', handleClearPaste);
    elementsWithContentEditable.forEach((item) => {
        if (item.classList.contains('selected')) {
            TargetElement = item;
            TargetElement.insertAdjacentElement("afterend", NewDiv);
            NewDiv.focus();
        }
    });
});
//# sourceMappingURL=formater_buttons.js.map