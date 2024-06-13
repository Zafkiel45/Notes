import { HandleKeyFormater } from "./formater_buttons.js";
const ContainerMain = document.querySelector("#container_main");
export let content;
const RegexArray = [/^(#{1,6})\s+(.+?)\s*$/m, /^>\s+.*$/m];
function HandleTitles() {
  const nodes = document.querySelectorAll('.line');
  console.log(nodes.length);
  nodes.forEach(element => {
    const matches = RegexArray[0].test(String(element.textContent).trim());
    console.log(element.textContent);
    if (matches) {
      element.classList.add("title_md");
    } else {
      element.classList.remove('title_md');
    }
  });
}
function HandleCitations() {
  const nodes = document.querySelectorAll('.line');
  nodes.forEach(item => {
    const match = RegexArray[1].test(String(item.textContent).trim());
    if (match) {
      item.classList.add('citations_md');
    } else {
      item.classList.remove('citations_md');
    }
    ;
  });
}
;
export function HandleContentInEditor() {
  const AllContentOfLine = document.querySelectorAll(".line");
  let NewStringContent = "";
  AllContentOfLine.forEach(item => {
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
export function HandleSelection() {
  const AllElements = document.querySelectorAll(".selection");
  AllElements.forEach(item => {
    if (item.classList.contains("selection")) {
      item.classList.remove("selection");
    }
  });
}
export function moveCursorToEndOfLine(contentEditableElement) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(contentEditableElement);
  range.collapse(false);
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
export function handleClearPaste(e) {
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
export function HandleDeleteElements(element) {
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
          item.previousElementSibling.classList.add("selection");
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
  target.removeEventListener("keydown", HandleCallKeyEventBold);
  target.removeEventListener("keydown", HandleCallKeyEventItalic);
}
export function HandleEditor(element) {
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
    HandleTitles();
    HandleCitations();
    moveCursorToEndOfLine(CurrentElement);
  } catch (mensage) {
    console.log(mensage);
    return;
  }
}
export function HandleUpdateContent() {
  content = String(ContainerMain.textContent);
}
export function HandleEnterInEditor(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const NewDivLine = document.createElement("div");
    const NewSpanContent = document.createElement("span");
    const AllSelection = Array.from(document.querySelectorAll(".selection"));
    const SelectedElement = AllSelection.find(item => {
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
    NewSpanContent.addEventListener("keydown", e => {
      HandleKeyFormater(e, 'i', '__text__');
    });
    NewSpanContent.addEventListener("keydown", e => {
      HandleKeyFormater(e, 'b', '**text**');
    });
    SelectedElement?.insertAdjacentElement("afterend", NewDivLine);
    HandleSelection();
    NewDivLine.classList.add("selection");
    NewSpanContent.focus();
  }
}
export function HandleAddSelection(e) {
  const CurrentElement = e.target;
  const AllLines = document.querySelectorAll(".line");
  HandleSelection();
  AllLines.forEach(item => {
    if (item.contains(CurrentElement)) {
      item.classList.add("selection");
    }
  });
}
function HandleCallKeyEventItalic(e) {
  HandleKeyFormater(e, 'i', '__text__');
}
function HandleCallKeyEventBold(e) {
  HandleKeyFormater(e, 'b', '**text**');
}
(function () {
  const ContentOfLineID = document.querySelector("#contentOfLineID");
  ContentOfLineID.focus();
  ContentOfLineID.addEventListener("input", HandleEditor);
  ContentOfLineID.addEventListener("input", HandleUpdateContent);
  ContentOfLineID.addEventListener("paste", handleClearPaste);
  ContentOfLineID.addEventListener("keydown", HandleEnterInEditor);
  ContentOfLineID.addEventListener("click", HandleAddSelection);
  ContentOfLineID.addEventListener("keydown", HandleCallKeyEventItalic);
  ContentOfLineID.addEventListener("keydown", HandleCallKeyEventBold);
})();