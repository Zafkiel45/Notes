const textarea = document.querySelector("#content") as HTMLDivElement;
const main = document.querySelector("#container_main") as HTMLDivElement;

export let content: string;

export function HandleElementContent() {
  try {
    const Editables = main.querySelectorAll('.editable');

    if(!Editables || !main) {
      throw Error("Lista de Editables vazia");
    }

    const EditableArray: HTMLDivElement[] = Array.from(Editables).map(item => item as HTMLDivElement);
    let NewContent: String = ''
  
    for(let c = 0; c < EditableArray.length; c++) {
      const elementArray = EditableArray[c];
      const elementString = elementArray.textContent ?? '';

      if(elementArray !== null && elementArray !== undefined) {
        NewContent = NewContent + elementString + '\n\n';
      }
    }

    content = content + '\n\n' + NewContent;
  } catch(mensage) {
    console.log(mensage)
  }


}

textarea.addEventListener("input", (event: Event) => {
    const targetElement = event.target as HTMLDivElement;


    content = String(targetElement.textContent);
});
textarea.addEventListener('blur', handleBlur);
textarea.addEventListener('focus', handleFocus);
textarea.addEventListener('keydown', HandleEditorElements);
textarea.addEventListener('input', handleFormaterCharacteres);

function handleFormaterCharacteres(Event: Event) {
  const regex: RegExp = /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm;
  const Div = Event.target as HTMLDivElement;

  if(regex.test(String(Div.textContent))) {
    Div.classList.add('title');
  } else {
    Div.classList.remove('title');
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

function HandleEditorElements(e: KeyboardEvent) {
  if(e.key === 'Enter') {
    e.preventDefault();
    const newElement = document.createElement('div');
    
    if(window.matchMedia("(prefers-color-scheme: dark)").matches){
      newElement.className = 'text_area_darkmode editable';
    } else {
      newElement.className = 'text_area editable';
    }

    newElement.contentEditable = 'true';
    newElement.addEventListener('keydown', HandleEditorElements);
    newElement.addEventListener('keydown', DeleteElement);
    newElement.addEventListener('input', handleFormaterCharacteres);
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
