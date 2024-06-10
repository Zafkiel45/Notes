export let content;
export function ClearContentElement() {
  content = "";
}
export function isCursorAtEnd(element) {
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
  const Contents = document.querySelectorAll(".contentOfLine");
  let NewContent = null;
  Contents.forEach(item => {
    NewContent += String(item.textContent);
  });
  const WhiteSpacesFormated = String(NewContent).replace(/\n/g, "<br>");
  return content = String(WhiteSpacesFormated);
}
function moveCursorToEndOfLine(contentEditableElement) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(contentEditableElement);
  range.collapse(false);
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
function handleClearPaste(e) {
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
  const div = e.target;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(fragment);
    selection.removeAllRanges();
    div.focus();
    moveCursorToEndOfLine(div);
    content = String(e.target.textContent);
  } else {
    div.innerHTML = pasteContent;
    div.focus();
    moveCursorToEndOfLine(div);
    content = String(e.target.textContent);
  }
}
(function () {
  const AllContentOfLine = document.querySelectorAll(".contentOfLine");
  const ContentOfLineID = document.querySelector("#contentOfLineID");
  const ContainerMain = document.querySelector("#container_main");
  ContentOfLineID.focus();
  ContentOfLineID.addEventListener("input", HandleEditor);
  ContentOfLineID.addEventListener("input", HandleUpdateContent);
  ContentOfLineID.addEventListener("paste", handleClearPaste);
  ContentOfLineID.addEventListener("keydown", HandleEnterInEditor);
  ContentOfLineID.addEventListener("click", HandleAddSelection);
  function HandleEditor(element) {
    const CurrentElement = element.target;
    const CurrentTextContent = String(CurrentElement.textContent) ?? "";
    try {
      if (!CurrentElement || CurrentTextContent === "") {
        throw new TypeError("Conteúdo vazio ou inexistente");
      }
      const AllWordOfTextContent = CurrentTextContent.split(/\s+/);
      CurrentElement.textContent = "";
      AllWordOfTextContent.forEach((item, index) => {
        const NewSpan = document.createElement("span");
        NewSpan.textContent = item;
        if (index !== AllWordOfTextContent.length - 1) {
          NewSpan.innerHTML += "&nbsp;";
        }
        CurrentElement.appendChild(NewSpan);
      });
      moveCursorToEndOfLine(CurrentElement);
    } catch (mensage) {
      console.log(mensage);
      return;
    }
  }
  function HandleUpdateContent() {
    content = String(ContainerMain.textContent);
  }
  function HandleEnterInEditor(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const NewDivLine = document.createElement("div");
      const NewSpanContent = document.createElement("span");
      const AllSelection = Array.from(document.querySelectorAll(".selection"));
      const SelectedElement = AllSelection.find(item => {
        return item.classList.contains('selection');
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
      NewDivLine.classList.add('selection');
      NewSpanContent.focus();
    }
  }
  function HandleDeleteElements(element) {
    const CurrentElementr = element.target;
    const CurrentTextContent = String(CurrentElementr.textContent);
    const AllLines = document.querySelectorAll(".line");
    if (element.key === "Backspace" && CurrentTextContent.trim() === "") {
      AllLines.forEach(item => {
        if (item.contains(CurrentElementr)) {
          HandleRemoveEvents(CurrentElementr);
          if (item.previousElementSibling && "focus" in item.previousElementSibling) {
            HandleSelection();
            item.previousElementSibling.lastElementChild.focus();
            moveCursorToEndOfLine(item.previousElementSibling.lastElementChild);
            item.previousElementSibling.classList.add('selection');
          }
          CurrentElementr.remove();
          item.remove();
          return;
        }
      });
    }
  }
  function HandleRemoveEvents(target) {
    target.removeEventListener("input", HandleEditor);
    target.removeEventListener("input", HandleUpdateContent);
    target.removeEventListener("paste", handleClearPaste);
    target.removeEventListener("keydown", HandleEnterInEditor);
    target.removeEventListener("keydown", HandleDeleteElements);
  }
  function HandleSelection() {
    const AllElements = document.querySelectorAll(".selection");
    AllElements.forEach(item => {
      if (item.classList.contains('selection')) {
        item.classList.remove('selection');
      }
    });
  }
  function HandleAddSelection(e) {
    const CurrentElement = e.target;
    const AllLines = document.querySelectorAll(".line");
    HandleSelection();
    AllLines.forEach(item => {
      if (item.contains(CurrentElement)) {
        item.classList.add('selection');
      }
    });
  }
})();