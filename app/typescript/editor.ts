import { handleSelectionElement } from "./export.js";
import { HandleItalicFormaterKeyDown, HandleBoldFormaterKeyDown } from "./formater_buttons.js";

const textarea = document.querySelector("#content") as HTMLDivElement;
const main = document.querySelector("#container_main") as HTMLDivElement;

export let content: string;

export function HandleElementContent() {
  try {
    const Editables = main.querySelectorAll<HTMLDivElement>(".editable");

    if (!Editables || !main) {
      throw Error("Lista de Editables vazia");
    }

    let NewContent: String = "";

    Editables.forEach(editable => {
      const elementString = editable.textContent ?? "";
      NewContent += elementString + "\n\n";
    });
    
    content = content + "\n\n" + NewContent;

  } catch (mensage) {
    console.log(mensage);
  }
}
export function ClearContentElement() {
  content = '';
}

textarea.addEventListener("input", (event: Event) => {
  content = String((event.target as HTMLDivElement).textContent) ?? '';
});

textarea.addEventListener("blur", handleBlur);
textarea.addEventListener("focus", handleFocus);
textarea.addEventListener("keydown", HandleEditorElements);
textarea.addEventListener('keydown', HandleItalicFormaterKeyDown);
textarea.addEventListener('keydown', HandleBoldFormaterKeyDown);
textarea.addEventListener("input", handleFormatterCharacters);
textarea.addEventListener("click", handleSelectionElement);
textarea.addEventListener("paste", handleClearPaste);

export function handleFormatterCharacters(Event: Event) {
  const regex: RegExp = /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm;
  const targetElement = Event.target as HTMLDivElement;
  const targetElementTextoContent: string = String(targetElement.textContent);

  if (regex.test(targetElementTextoContent) && targetElement) {
    targetElement.classList.remove("title", "title_2", "title_3");

    const titleLevelMatch = targetElementTextoContent.match(/^#+/);
    if (titleLevelMatch) {
      const titleLevel = Number(titleLevelMatch[0].length);
      switch (titleLevel) {
        case 1:
          targetElement.classList.add("title");
          break;
        case 2:
          targetElement.classList.add("title_2");
          break;
        case 3:
          targetElement.classList.add("title_3");
          break;
        default:
          break;
      }
    }
  } else {
    targetElement.classList.remove("title", "title_2", "title_3");
  }
}
function handleFocus(event: FocusEvent) {
  const div = event.target as HTMLDivElement;
  const div_textContent = String(div.textContent);
  if (div_textContent.trim() === "") {
    div.classList.remove("placeholder");
  }
}
function handleBlur(event: FocusEvent) {
  const div = event.target as HTMLDivElement;
  const div_textContent = String(div.textContent);
  if (div_textContent.trim() === "") {
    div.classList.add("placeholder");
  }
}
export function isCursorAtEnd(element: HTMLDivElement) {
  const selection = window.getSelection();
  const nodeList = element.lastChild;

  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const endNode = range.endContainer;
  const endOffset = range.endOffset;

  if(endNode.nodeType === endNode.TEXT_NODE) {
    return endOffset === nodeList?.textContent?.length;
  }

  return endOffset === element.childNodes.length;
}
export function handleClearPaste(e: ClipboardEvent) {
  e.preventDefault();
  let pasteContent = e.clipboardData?.getData("text/plain");

  if (!pasteContent) {
    console.log("No text content to paste.");
    return;
  }
  
  pasteContent = pasteContent.replace(/\n/g, '<br>');

  const fragment = document.createDocumentFragment();
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = pasteContent;

  while (tempDiv.firstChild) {
    fragment.appendChild(tempDiv.firstChild);
  }

  const div = e.target as HTMLDivElement;
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents(); 
    range.insertNode(fragment); 
    selection.removeAllRanges();
    div.focus();
    moveCursorToEndOfLine(div); 
  } else {
    div.innerHTML = pasteContent; 
    div.focus();
    moveCursorToEndOfLine(div);
  }
}
export function handleCurrentSelectionElement():void {
  const elementsWithContentEditable = document.querySelectorAll<HTMLDivElement>(
    "div[contenteditable]"
  );
  
  elementsWithContentEditable.forEach((item) => {
    if(item.classList.contains('selected')) {
      item.classList.remove('selected');
    }
  });
}
export function HandleEditorElements(e: KeyboardEvent) {
  const div = e.target as HTMLDivElement;

  if (e.key === "Enter" && isCursorAtEnd(div)) {
      e.preventDefault();

      const newElement = document.createElement("div");
      const currentTheme = localStorage.theme;
      newElement.className = currentTheme === 'dark' ? 
      'text_area_darkmode editable':'text_area editable';

      newElement.contentEditable = "true";
      newElement.addEventListener("keydown", HandleEditorElements);
      newElement.addEventListener("keydown", DeleteElement);
      newElement.addEventListener("input", handleFormatterCharacters);
      newElement.addEventListener("click", handleSelectionElement);
      newElement.addEventListener("paste", handleClearPaste);
      newElement.addEventListener("keydown", HandleItalicFormaterKeyDown);
      newElement.addEventListener("keydown", HandleBoldFormaterKeyDown);
      newElement.innerHTML = "";

      handleCurrentSelectionElement();
      newElement.classList.add('selected');

      div.insertAdjacentElement("afterend",newElement);
      newElement.focus();
    } else {
      console.log('não está no fim da linha!')
    }
}
export function DeleteElement(event: KeyboardEvent) {
  if (event.target && event.target instanceof HTMLElement) {
    const target = event.target as HTMLDivElement;

    if (event.key === "Backspace" && target.textContent?.trim() === "") {
      removeEventListenersFromEditable(target);

      if (
        target.previousElementSibling &&
        "focus" in target.previousElementSibling
      ) {
        (target.previousElementSibling as HTMLDivElement).focus();
        moveCursorToEndOfLine(target.previousElementSibling as HTMLDivElement);
      }
      
      if(event.target.parentNode ) {
        target.parentNode?.removeChild(target)
      }
    }
  }
}
function removeEventListenersFromEditable(element: HTMLDivElement) {
  element.removeEventListener("keydown", HandleEditorElements);
  element.removeEventListener("keydown", DeleteElement);
  element.removeEventListener("input", handleFormatterCharacters);
  element.removeEventListener("click", handleSelectionElement);
  element.removeEventListener("paste", handleClearPaste);
  element.removeEventListener("keydown", HandleItalicFormaterKeyDown);
  element.removeEventListener("keydown", HandleBoldFormaterKeyDown);
}
export function moveCursorToEndOfLine(contentEditableElement: any) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(contentEditableElement);

  range.collapse(false);

  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

