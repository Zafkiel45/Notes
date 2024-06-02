import { 
    DeleteElement,
    HandleEditorElements,
    handleClearPaste
} from "./editor.js";

const bold_btn = document.querySelector("#bold_button") as HTMLButtonElement;
const italic_btn = document.querySelector("#italic_button") as HTMLButtonElement;
const list_btn = document.querySelector("#list_button") as HTMLButtonElement;
const code_btn = document.querySelector("#code_button") as HTMLButtonElement;
const table_btn = document.querySelector("#table_button") as HTMLButtonElement;
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
    NewPre.spellcheck = false;

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
table_btn.addEventListener('click', () => {
  const NewDiv = document.createElement('div');
  const elementsWithContentEditable = document.querySelectorAll<HTMLDivElement>(
    "div[contenteditable]"
  );

  NewDiv.className = 'table editable';
  NewDiv.contentEditable = 'true';
  NewDiv.textContent = `| Header 1 | Header 2 |
  | -------- | -------- |
  | Item 1   | item 2   |
  `

  let TargetElement: Element;

  NewDiv.addEventListener('keydown', HandleEditorElements);
  NewDiv.addEventListener('keydown', DeleteElement);
  NewDiv.addEventListener('paste', handleClearPaste);

  elementsWithContentEditable.forEach((item) => {
    if(item.classList.contains('selected')) {
      TargetElement = item;
      (TargetElement as HTMLDivElement).insertAdjacentElement(
        "afterend",
        NewDiv
      );
      NewDiv.focus();
    }
  })

})
