type SpanElement = HTMLSpanElement;
const ContainerMain = document.querySelector(
  "#container_main",
) as HTMLDivElement;

export let content: string;
const RegexArray = [
 /^(#{1,6})\s+(.+?)\s*$/m,
]

function HandleTitles() {
  const nodes = document.querySelectorAll<HTMLDivElement>('.line');

  console.log(nodes.length);
  nodes.forEach((element) => {
    const matches = RegexArray[0].test(String(element.textContent).trim());
    console.log(element.textContent);
    if (matches) {
      element.classList.add("title_md");
    } else {
      element.classList.remove('title_md');
    }
  })
}

export function HandleContentInEditor() {
  const AllContentOfLine = document.querySelectorAll<HTMLDivElement>(".line");
  let NewStringContent: string = "";

  AllContentOfLine.forEach((item) => {
    NewStringContent += String(item.textContent) + "\n";
  });

  if (NewStringContent) {
    content = String(NewStringContent);
  }
  return content.trim();
}
export function ClearContentElement() {
  content = "";
}
export function isCursorAtEnd(element: HTMLPreElement) {
  const selection = window.getSelection();
  const nodeList = element.lastChild;

  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const endNode = range.endContainer;
  const endOffset = range.endOffset;

  if (endNode.nodeType === endNode.TEXT_NODE) {
    return endOffset === nodeList?.textContent?.length;
  }

  return endOffset === element.childNodes.length;
}
export function HandleSelection() {
  const AllElements = document.querySelectorAll<SpanElement>(".selection");

  AllElements.forEach((item) => {
    if (item.classList.contains("selection")) {
      item.classList.remove("selection");
    }
  });
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
export function handleClearPaste(e: ClipboardEvent) {
  e.preventDefault();
  let pasteContent = e.clipboardData?.getData("text/plain");

  if (!pasteContent) {
    console.log("No text content to paste.");
    return;
  }

  pasteContent = pasteContent.replace(/\n/g, "<br>");

  const fragment = document.createDocumentFragment();
  const tempDiv = document.createElement("div");
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
    content = String((e.target as HTMLDivElement).textContent);
  } else {
    div.innerHTML = pasteContent;
    div.focus();
    moveCursorToEndOfLine(div);
    content = String((e.target as HTMLDivElement).textContent);
  }
}
export function HandleDeleteElements(element: KeyboardEvent) {
  const CurrentElementr = element.target as SpanElement;
  const CurrentTextContent = String(CurrentElementr.textContent);
  const AllLines = document.querySelectorAll<HTMLDivElement>(".line");

  if (element.key === "Backspace" && CurrentTextContent.trim() === "") {
    AllLines.forEach((item) => {
      if (item.contains(CurrentElementr)) {
        HandleRemoveEvents(CurrentElementr);

        if (
          item.previousElementSibling &&
          "focus" in item.previousElementSibling
        ) {
          HandleSelection();
          (
            item.previousElementSibling.lastElementChild as SpanElement
          ).focus();
          moveCursorToEndOfLine(
            item.previousElementSibling.lastElementChild as SpanElement,
          );
          (item.previousElementSibling as HTMLDivElement).classList.add(
            "selection",
          );
        }

        CurrentElementr.remove();
        item.remove();
        return;
      }
    });
  }
}
function HandleRemoveEvents(target: SpanElement) {
  target.removeEventListener("input", HandleEditor);
  target.removeEventListener("input", HandleUpdateContent);
  target.removeEventListener("paste", handleClearPaste);
  target.removeEventListener("keydown", HandleEnterInEditor);
  target.removeEventListener("keydown", HandleDeleteElements);
}
export function HandleEditor(element: Event) {
  const CurrentElement: SpanElement = element.target as HTMLSpanElement;
  const CurrentTextContent: string = String(CurrentElement.textContent) ?? "";

  try {
    if (!CurrentElement || CurrentTextContent === "") {
      throw new TypeError("Conteúdo vazio ou inexistente");
    }
    // divide todas as palavras com espaços em branco.
    const AllWordOfTextContent = CurrentTextContent.split(/\s+/);

    CurrentElement.textContent = "";

    AllWordOfTextContent.forEach((item, index) => {
      const NewSpan = document.createElement("span");

      NewSpan.textContent = item;
      // checa se a posição do elemento atual é diferente do comprimento
      // evitando espaços em branco adicionais desnecessários.
      if (index !== AllWordOfTextContent.length - 1) {
        NewSpan.innerHTML += "&nbsp;";
      }

      CurrentElement.appendChild(NewSpan);
      });
    HandleTitles();
    moveCursorToEndOfLine(CurrentElement);
  } catch (mensage) {
    console.log(mensage);
    return;
  }
}
export function HandleUpdateContent() {
  content = String(ContainerMain.textContent);
}
export function HandleEnterInEditor(event: KeyboardEvent) {
  if (event.key === "Enter") {
    event.preventDefault();

    const NewDivLine = document.createElement("div");
    const NewSpanContent = document.createElement("span");
    const AllSelection = Array.from(document.querySelectorAll(".selection"));
    const SelectedElement = AllSelection.find((item) => {
      return item.classList.contains("selection");
    });

    NewDivLine.appendChild(NewSpanContent);
    NewDivLine.className = "line";
    NewSpanContent.className = "contentOfLine";
    NewSpanContent.contentEditable = "true";

    NewSpanContent.addEventListener("input", HandleEditor);
    NewSpanContent.addEventListener("input", HandleUpdateContent);
    NewSpanContent.addEventListener("paste", handleClearPaste);
    NewSpanContent.addEventListener("keydown", HandleEnterInEditor);
    NewSpanContent.addEventListener("keydown", HandleDeleteElements);
    NewSpanContent.addEventListener("click", HandleAddSelection);

    SelectedElement?.insertAdjacentElement("afterend", NewDivLine);
    HandleSelection();

    NewDivLine.classList.add("selection");
    NewSpanContent.focus();
  }
}
// função responsável por remover todos as classes .selection
// assim garantido que não haja mais de um elemento com .selection
export function HandleAddSelection(e: MouseEvent) {
  const CurrentElement = e.target as SpanElement;
  const AllLines = document.querySelectorAll<HTMLDivElement>(".line");

  HandleSelection();

  AllLines.forEach((item) => {
    if (item.contains(CurrentElement)) {
      item.classList.add("selection");
    }
  });
}

(function () {
  const ContentOfLineID = document.querySelector(
    "#contentOfLineID",
  ) as HTMLSpanElement;

  ContentOfLineID.focus();
  ContentOfLineID.addEventListener("input", HandleEditor);
  ContentOfLineID.addEventListener("input", HandleUpdateContent);
  ContentOfLineID.addEventListener("paste", handleClearPaste);
  ContentOfLineID.addEventListener("keydown", HandleEnterInEditor);
  ContentOfLineID.addEventListener("click", HandleAddSelection);

})();
