const textarea = document.querySelector("#content") as HTMLDivElement; 
const link = document.querySelector("#link") as HTMLAnchorElement;
const export_button = document.querySelector(
  "#export_button"
) as HTMLButtonElement;
const bold_button = document.querySelector("#bold_button") as HTMLButtonElement;
const italic_button = document.querySelector("#italic_button") as HTMLButtonElement;
const list_button = document.querySelector("#list_button") as HTMLButtonElement;
const code_button = document.querySelector("#code_button") as HTMLButtonElement;

import { Formater } from "./convert.js";

export let content: string;

// formater buttons
bold_button.addEventListener("click", () => {
    textarea.innerText = textarea.innerText + '**text**';
})
italic_button.addEventListener('click', () => {
    textarea.innerText = textarea.innerText + '__text__';
})
code_button.addEventListener('click', () => {
  textarea.innerText = textarea.innerText + '\n```js\n```'
})
list_button.addEventListener('click', () => {
  textarea.innerText = textarea.innerText + '\n-'
})
// editor
textarea.addEventListener("input", (event: Event) => {
  const targetElement = event.target as HTMLDivElement;
  content = String(targetElement.textContent);
});
textarea.addEventListener('blur', handleBlur);
textarea.addEventListener('focus', handleFocus);
textarea.addEventListener('keydown', HandleEditorElements);

function HandleEditorElements(e: KeyboardEvent) {
  if(e.key === 'Enter') {
    e.preventDefault();
    const newElement = document.createElement('div');
    
    if(window.matchMedia("(prefers-color-scheme: dark)").matches){
      newElement.className = 'text_area_darkmode';
    } else {
      newElement.className = 'text_area';
    }

    newElement.contentEditable = 'true';
    newElement.addEventListener('keydown', HandleEditorElements);
    newElement.innerHTML = '';

    (e.target as HTMLDivElement).insertAdjacentElement('afterend', newElement);
    newElement.focus();
  }
}
function handleFocus(event: any) {
  const div = event.target;
  if (div.textContent.trim() === '') {
    div.classList.remove('placeholder');
  }
}

function handleBlur(event: any) {
  const div = event.target;
  if (div.textContent.trim() === '') {
    div.classList.add('placeholder');
  }
}
// export 
function ExportFile(markdown:string):void {

  let blob:Blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  let url:string = URL.createObjectURL(blob);

  link.href = url;
  link.download = "document.md";

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}

export_button.addEventListener("click", () => {
  ExportFile(Formater());
});
