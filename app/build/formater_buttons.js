import { HandleSelection, moveCursorToEndOfLine } from "./editor.js";
import { isCursorAtEnd } from "./editor.js";
import { HandleDeleteElements, HandleEnterInEditor, HandleEditor, HandleUpdateContent, handleClearPaste, HandleAddSelection } from "./editor.js";
const code_btn = document.querySelector("#code_button");
const italic_btn = document.querySelector("#italic_button");
const bold_btn = document.querySelector("#bold_button");
code_btn.addEventListener('click', HandleCodeBlock);
italic_btn.addEventListener('click', () => {
  HandleFormating('__text__');
});
bold_btn.addEventListener('click', () => {
  HandleFormating('**text**');
});
function HandleCodeBlock() {
  const LineElements = Array.from(document.querySelectorAll('.line'));
  const NewPreElement = document.createElement('pre');
  const NewDivLine = document.createElement('div');
  NewDivLine.appendChild(NewPreElement);
  NewDivLine.className = 'line line_of_block';
  NewPreElement.className = 'code_block';
  NewPreElement.contentEditable = 'true';
  NewPreElement.textContent = '```javascript\n\n```';
  NewPreElement.addEventListener('click', HandleAddSelection);
  NewPreElement.addEventListener('keydown', HandleNewElementCodeBlock);
  NewPreElement.addEventListener('keydown', HandleDeleteElements);
  NewPreElement.addEventListener('paste', handleClearPaste);
  const TheSelectedElement = LineElements.find(item => {
    return item.classList.contains('selection');
  });
  HandleSelection();
  TheSelectedElement?.insertAdjacentElement('afterend', NewDivLine);
  NewDivLine.classList.add('selection');
  NewPreElement.focus();
}
;
function HandleNewElementCodeBlock(element) {
  const CurrentElement = element.target;
  if (element.key === 'Enter' && isCursorAtEnd(CurrentElement)) {
    element.preventDefault();
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
    SelectedElement?.insertAdjacentElement("afterend", NewDivLine);
    HandleSelection();
    NewDivLine.classList.add("selection");
    NewSpanContent.focus();
  }
}
function HandleFormating(formater) {
  const SelectedElement = document.querySelector('.selection');
  const TextContentOfSelectionElement = SelectedElement?.textContent ?? '';
  const FirstChild = SelectedElement?.firstElementChild;
  try {
    if (!SelectedElement) {
      throw new Error('O elemento não existe');
    }
    if (FirstChild) {
      FirstChild.textContent = '';
      FirstChild.textContent = TextContentOfSelectionElement + formater;
      FirstChild.focus();
      moveCursorToEndOfLine(FirstChild);
    }
  } catch (mensage) {
    console.log(`ocorreu o seguinte erro ${mensage}`);
    return;
  }
}
export function HandleKeyFormater(element, key, formater) {
  if (element.ctrlKey) {
    if (element.key.toLocaleLowerCase() === key) {
      HandleFormating(formater);
    }
  }
}