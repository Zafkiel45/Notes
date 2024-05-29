const textarea = document.querySelector("#content") as HTMLDivElement;
const main = document.querySelector("#container_main") as HTMLDivElement;
import { handleSelectionElement } from "./export.js";
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

textarea.addEventListener("input", (event: Event) => {
  const targetElement = event.target as HTMLDivElement;

  content = String(targetElement.textContent);
});
textarea.addEventListener("blur", handleBlur);
textarea.addEventListener("focus", handleFocus);
textarea.addEventListener("keydown", HandleEditorElements);
textarea.addEventListener("input", handleFormaterCharacteres);
textarea.addEventListener("click", handleSelectionElement);
textarea.addEventListener("paste", handleClearPaste);

function handleFormaterCharacteres(Event: Event) {
  const regex: RegExp = /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm;
  const Div = Event.target as HTMLDivElement;

  if (regex.test(String(Div.textContent))) {
    Div.classList.add("title");
  } else {
    Div.classList.remove("title");
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
function isCursorAtEnd(element: HTMLDivElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const endNode = range.endContainer;
  const endOffset = range.endOffset;

  // Verifica se o cursor está no final do nó de texto
  if (endNode.nodeType === Node.TEXT_NODE) {
    return endOffset === (endNode.nodeValue ? endNode.nodeValue.length : 0);
  }

  // Verifica se o cursor está no final do elemento
  return endOffset === element.childNodes.length;
}
function handleClearPaste(e: ClipboardEvent) {
  e.preventDefault();
  const pasteContent = e.clipboardData?.getData("text/plain");

  // Verifica se há conteúdo para colar
  if (!pasteContent) {
    console.log("No text content to paste.");
    return;
  }

  const fragment = document.createDocumentFragment();
  fragment.appendChild(document.createTextNode(pasteContent));

  
  const div = e.target as HTMLDivElement;
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents(); 
    range.insertNode(fragment); 
    selection.removeAllRanges(); 
  } else {
    div.textContent = pasteContent;
  }
}
function HandleEditorElements(e: KeyboardEvent) {
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
      newElement.addEventListener("input", handleFormaterCharacteres);
      newElement.addEventListener("click", handleSelectionElement);
      newElement.addEventListener("paste", handleClearPaste);
      newElement.innerHTML = "";

      (e.target as HTMLDivElement).insertAdjacentElement(
        "afterend",
        newElement
      );
      newElement.focus();
    }
  }
}
function DeleteElement(event: KeyboardEvent) {
  if (event.target && event.target instanceof HTMLElement) {
    const target = event.target as HTMLDivElement;

    if (event.key === "Backspace" && target.textContent?.trim() === "") {
      target.removeEventListener("keydown", HandleEditorElements);
      target.removeEventListener("keydown", DeleteElement);
      target.removeEventListener("input", handleFormaterCharacteres);
      target.removeEventListener("click", handleSelectionElement);
      target.removeEventListener("paste", handleClearPaste);

      if (
        target.previousElementSibling &&
        "focus" in target.previousElementSibling
      ) {
        (target.previousElementSibling as HTMLDivElement).focus();
        moveCursorToEndOfLine(target.previousElementSibling as HTMLDivElement);
      }

      main.removeChild(event.target as HTMLElement);
    }
  }
}
function moveCursorToEndOfLine(contentEditableElement: any) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(contentEditableElement);

  range.collapse(false);

  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
