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
    if(event.key === 'Backspace' && (event.target as HTMLDivElement).textContent?.trim() === '') {
        (event.target as HTMLElement).removeEventListener('keydown', HandleEditorElements);
        (event.target as HTMLElement).removeEventListener('keydown', DeleteElement);
        main.removeChild(event.target as HTMLElement);
    }
}