const textarea = document.querySelector("#content") as HTMLDivElement;
const main = document.querySelector("#container_main") as HTMLDivElement;

export let content: string;


textarea.addEventListener("input", (event: Event) => {
    const targetElement = event.target as HTMLDivElement;
    content = String(targetElement.textContent);
  });
textarea.addEventListener('blur', handleBlur);
textarea.addEventListener('focus', handleFocus);
textarea.addEventListener('keydown', HandleEditorElements);
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
    newElement.addEventListener('keydown', DeleteElement);
    newElement.innerHTML = '';

    (e.target as HTMLDivElement).insertAdjacentElement('afterend', newElement);
    newElement.focus();
  }
}

function DeleteElement(event: KeyboardEvent) {
  if(event.target && event.target instanceof HTMLElement) {
    const target = event.target as HTMLDivElement;

    if(event.key === 'Backspace' && target.textContent?.trim() === '') {
        target.removeEventListener('keydown', HandleEditorElements);
        target.removeEventListener('keydown', DeleteElement);

        if (target.previousElementSibling && 'focus' in target.previousElementSibling) {
            (target.previousElementSibling as HTMLDivElement).focus();
            moveCursorToEndOfLine((target.previousElementSibling as HTMLDivElement))
        } 

        main.removeChild(event.target as HTMLElement);
    }
  }

}

function moveCursorToEndOfLine(contentEditableElement:any) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(contentEditableElement);

  range.collapse(false);

  if(selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
