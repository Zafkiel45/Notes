
export let content: string;

export function ClearContentElement() {
  content = "";
}
export function isCursorAtEnd(element: HTMLDivElement) {
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
export function HandleContentInEditor() {
  const Contents = document.querySelectorAll<HTMLSpanElement>('.contentOfLine');
  let NewContent: string | null = null;

  Contents.forEach((item) => {
    NewContent += String(item.textContent);
  })

  const WhiteSpacesFormated = String(NewContent).replace(/\n/g, '<br>');

  return content = String(WhiteSpacesFormated);
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
function handleClearPaste(e: ClipboardEvent) {
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

(function() {
  const textarea = document.querySelector("#content") as HTMLDivElement;
  const AllContentOfLine = document.querySelectorAll<HTMLSpanElement>('.contentOfLine');
  const ContentOfLineID = document.querySelector("#contentOfLineID") as HTMLSpanElement;
  const ContainerMain = document.querySelector("#container_main") as HTMLDivElement;
  
  // types 
  type SpanElement = HTMLSpanElement;
  
  ContentOfLineID.addEventListener("input", HandleEditor);
  ContentOfLineID.addEventListener("input", HandleUpdateContent);
  ContentOfLineID.addEventListener("paste", handleClearPaste);
  ContentOfLineID.addEventListener("keydown", HandleEnterInEditor);

  function HandleEditor(element: Event) {
    const CurrentElement: SpanElement = element.target as HTMLSpanElement;
    const CurrentTextContent: string = String(CurrentElement.textContent) ?? '';
    
    try {
      if(!CurrentElement || CurrentTextContent === '') {
        throw new TypeError("Conteúdo vazio ou inexistente");
      }

      const AllWordOfTextContent = CurrentTextContent.split(/\s+/);

      CurrentElement.textContent = '';
  
      AllWordOfTextContent.forEach((item, index) => {
        const NewSpan = document.createElement("span");
  
        NewSpan.textContent = item;
        
        if (index!== AllWordOfTextContent.length - 1) {
          NewSpan.innerHTML += '&nbsp;';
        }
  
        CurrentElement.appendChild(NewSpan);
      })
      moveCursorToEndOfLine(CurrentElement);
    } catch(mensage) {
      console.log(mensage);
      return;
    }
  }
  function HandleUpdateContent() {
    content = String(ContainerMain.textContent)
  }
  function HandleEnterInEditor(event: KeyboardEvent) {

    if(event.key === 'Enter') {
      event.preventDefault(); 

      const NewDivLine = document.createElement('div');
      const NewSpanContent = document.createElement('span');

      NewDivLine.appendChild(NewSpanContent);
      NewDivLine.className = 'line';
      NewSpanContent.className = 'contentOfLine';
      NewSpanContent.contentEditable = 'true';

      NewSpanContent.addEventListener("input", HandleEditor);
      NewSpanContent.addEventListener("input", HandleUpdateContent);
      NewSpanContent.addEventListener("paste", handleClearPaste);
      NewSpanContent.addEventListener("keydown", HandleEnterInEditor);
      NewSpanContent.addEventListener("keydown", HandleDeleteElements);
      
      ContainerMain.appendChild(NewDivLine);
    }
  }
  function HandleDeleteElements(element: KeyboardEvent) {
    const CurrentElementr = element.target as SpanElement;
    const CurrentTextContent = String(CurrentElementr.textContent);
    const AllLines = document.querySelectorAll<HTMLDivElement>('.line');

    if(element.key === 'Backspace' && CurrentTextContent === '') {
      AllLines.forEach((item) => {
        if(item.contains(CurrentElementr)) {
          HandleRemoveEvents(CurrentElementr);
          CurrentElementr.remove();
          item.remove();
          return;
        }
      })
    }
  }
  function HandleRemoveEvents(target: SpanElement) {
    target.removeEventListener("input", HandleEditor);
    target.removeEventListener("input", HandleUpdateContent);
    target.removeEventListener("paste", handleClearPaste);
    target.removeEventListener("keydown", HandleEnterInEditor);
    target.removeEventListener("keydown", HandleDeleteElements);
  }
})();