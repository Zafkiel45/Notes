import { DeleteElement, HandleEditorElements, } from "./editor.js";
const bold_btn = document.querySelector("#bold_button");
const italic_btn = document.querySelector("#italic_button");
const list_btn = document.querySelector("#list_button");
const code_btn = document.querySelector("#code_button");
const main = document.querySelector('#container_main');
code_btn.addEventListener("click", () => {
    const NewPre = document.createElement('pre');
    const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
    let TargetElement;
    NewPre.className = 'code_block editable';
    NewPre.contentEditable = 'true';
    NewPre.textContent = '```javascript\n\n\n```';
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
//# sourceMappingURL=formater_buttons.js.map