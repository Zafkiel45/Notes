const textarea = document.querySelector("#content") as HTMLDivElement;
const main = document.querySelector("#container_main") as HTMLDivElement;
import { handleSelectionElement } from "./export.js";
import { HandleItalicFormaterKeyDown, HandleBoldFormaterKeyDown } from "./formater_buttons.js";
export let content: string;

export function HandleElementContent() {
  try {
    const Editables = main.querySelectorAll(".editable");

    if (!Editables || !main) {
      throw Error("Lista de Editables vazia");
    }

    const EditableArray: HTMLDivElement[] = Array.from(Editables).map(
      (item) => item as HTMLDivElement
    );
    let NewContent: String = "";

    for (let c = 0; c < EditableArray.length; c++) {
      const elementArray = EditableArray[c];
      const elementString = elementArray.textContent ?? "";

      if (elementArray !== null && elementArray !== undefined) {
        NewContent = NewContent + elementString + "\n\n";
      }
    }

    content = content + "\n\n" + NewContent;
  } catch (mensage) {
    console.log(mensage);
  }
}
export function ClearContentElement() {
  content = '';
}

textarea.addEventListener("input", (event: Event) => {
  const targetElement = event.target as HTMLDivElement;

  content = String(targetElement.textContent);
});
textarea.addEventListener("blur", handleBlur);
textarea.addEventListener("focus", handleFocus);
textarea.addEventListener("keydown", HandleEditorElements);
textarea.addEventListener("input", handleFormatterCharacters);
textarea.addEventListener("click", handleSelectionElement);
textarea.addEventListener("paste", handleClearPaste);
textarea.addEventListener('keydown', HandleItalicFormaterKeyDown);
textarea.addEventListener('keydown', HandleBoldFormaterKeyDown);

export function handleFormatterCharacters(Event: Event) {
  const regex: RegExp = /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm;
  const targetElement = Event.target as HTMLDivElement;

  if (regex.test(String(targetElement.textContent)) && targetElement) {
    targetElement.classList.remove("title", "title_2", "title_3");

    const titleLevelMatch = String(targetElement.textContent)?.match(/^#+/);
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
          // Não faça nada para níveis acima de 3
          break;
      }
    }
  } else {
    // Remova a classe de título se o conteúdo não seguir o padrão de título
    targetElement.classList.remove("title");
  }
}
function handleFocus(event: any) {
  const div = event.target;
  if (div.textContent.trim() === "") {
    div.classList.remove("placeholder");
  }
}
function handleBlur(event: any) {
  const div = event.target;
  if (div.textContent.trim() === "") {
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

  // Verifica se há conteúdo para colar
  if (!pasteContent) {
    console.log("No text content to paste.");
    return;
  }

  // Substitui quebras de linha por <br>
  pasteContent = pasteContent.replace(/\n/g, '<br>');

  const fragment = document.createDocumentFragment();
  // Cria um elemento temporário para converter o texto com <br> em nós reais
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = pasteContent;

  // Adiciona todos os filhos do elemento temporário ao fragmento
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
export function HandleEditorElements(e: KeyboardEvent) {
  const div = e.target as HTMLDivElement;

  if (e.key === "Enter") {
    if (isCursorAtEnd(div)) {
      e.preventDefault();
      const newElement = document.createElement("div");

      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        newElement.className = "text_area_darkmode editable";
      } else {
        newElement.className = "text_area editable";
      }

      newElement.contentEditable = "true";
      newElement.addEventListener("keydown", HandleEditorElements);
      newElement.addEventListener("keydown", DeleteElement);
      newElement.addEventListener("input", handleFormatterCharacters);
      newElement.addEventListener("click", handleSelectionElement);
      newElement.addEventListener("paste", handleClearPaste);
      newElement.addEventListener("keydown", HandleItalicFormaterKeyDown);
      newElement.addEventListener("keydown", HandleBoldFormaterKeyDown);
      newElement.innerHTML = "";

      const elementsWithContentEditable = document.querySelectorAll<HTMLDivElement>(
        "div[contenteditable]"
      );
      
      elementsWithContentEditable.forEach((item) => {
        if(item.classList.contains('selected')) {
          item.classList.remove('selected');
        }
      });

      newElement.classList.add('selected');

      (e.target as HTMLDivElement).insertAdjacentElement(
        "afterend",
        newElement
      );
      newElement.focus();
    } else {
      console.log('não está no fim da linha!')
    }
  }
}
export function DeleteElement(event: KeyboardEvent) {
  if (event.target && event.target instanceof HTMLElement) {
    const target = event.target as HTMLDivElement;

    if (event.key === "Backspace" && target.textContent?.trim() === "") {
      target.removeEventListener("keydown", HandleEditorElements);
      target.removeEventListener("keydown", DeleteElement);
      target.removeEventListener("input", handleFormatterCharacters);
      target.removeEventListener("click", handleSelectionElement);
      target.removeEventListener("paste", handleClearPaste);
      target.removeEventListener("keydown", HandleItalicFormaterKeyDown);
      target.removeEventListener("keydown", HandleBoldFormaterKeyDown);

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

