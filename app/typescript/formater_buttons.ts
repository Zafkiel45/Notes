type btn_type = HTMLButtonElement;
type element_type = HTMLDivElement;

import { HandleSelection } from "./editor.js";
import { isCursorAtEnd } from "./editor.js";
import { 
    HandleDeleteElements, 
    HandleEnterInEditor, 
    HandleEditor, 
    HandleUpdateContent, 
    handleClearPaste, 
    HandleAddSelection
} from "./editor.js";

const code_btn = document.querySelector("#code_button") as btn_type;
const italic_btn = document.querySelector("#italic_button") as btn_type;
const bold_btn = document.querySelector("#bolder_button") as btn_type;

code_btn.addEventListener('click', HandleCodeBlock);

function HandleCodeBlock() {
    const LineElements = Array.from(document.querySelectorAll<element_type>('.line'));

    const NewPreElement = document.createElement('pre');
    const NewDivLine = document.createElement('div');

    NewDivLine.appendChild(NewPreElement);
    NewDivLine.className = 'line line_of_block';
    NewPreElement.className = 'code_block';
    NewPreElement.contentEditable = 'true';
    NewPreElement.textContent = '```javascript\n\n```'
    
    NewPreElement.addEventListener('click', HandleAddSelection);
    NewPreElement.addEventListener('keydown', HandleNewElementCodeBlock);
    NewPreElement.addEventListener('keydown', HandleDeleteElements);
    NewPreElement.addEventListener('paste', handleClearPaste);

    const TheSelectedElement = LineElements.find((item) => {
        return item.classList.contains('selection');
    });

    HandleSelection();
    TheSelectedElement?.insertAdjacentElement('afterend', NewDivLine);

    NewDivLine.classList.add('selection');
    NewPreElement.focus();
};

function HandleNewElementCodeBlock(element: KeyboardEvent) {
    const CurrentElement = element.target as HTMLPreElement;

    if(element.key === 'Enter' && isCursorAtEnd(CurrentElement)) {
        element.preventDefault();

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



