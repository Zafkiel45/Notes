import { 
    DeleteElement,
    HandleEditorElements,
} from "./editor.js";

const bold_btn = document.querySelector("#bold_button") as HTMLButtonElement;
const italic_btn = document.querySelector("#italic_button") as HTMLButtonElement;
const list_btn = document.querySelector("#list_button") as HTMLButtonElement;
const code_btn = document.querySelector("#code_button") as HTMLButtonElement;
const main = document.querySelector('#container_main') as HTMLDivElement;

code_btn.addEventListener("click", () => {
    const NewPre = document.createElement('pre');
    const elementsWithContentEditable = document.querySelectorAll<HTMLDivElement>(
      "div[contenteditable]"
    );

    let TargetElement: Element;
  
    NewPre.className = 'code_block editable';
    NewPre.contentEditable = 'true';
    NewPre.textContent = '```javascript\n\n\n```'

    NewPre.addEventListener('keydown', HandleEditorElements);
    NewPre.addEventListener('keydown', DeleteElement);

    elementsWithContentEditable.forEach((item) => {
      if(item.classList.contains('selected')) {
        TargetElement = item;
        (TargetElement as HTMLDivElement).insertAdjacentElement(
          "afterend",
          NewPre
        );
        NewPre.focus();
      }
    })
});
