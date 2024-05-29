const textarea = document.querySelector("#content");
const main = document.querySelector("#container_main");
import { handleSelectionElement } from "./export.js";
export let content;
export function HandleElementContent() {
    var _a;
    try {
        const Editables = main.querySelectorAll('.editable');
        if (!Editables || !main) {
            throw Error("Lista de Editables vazia");
        }
        const EditableArray = Array.from(Editables).map(item => item);
        let NewContent = '';
        for (let c = 0; c < EditableArray.length; c++) {
            const elementArray = EditableArray[c];
            const elementString = (_a = elementArray.textContent) !== null && _a !== void 0 ? _a : '';
            if (elementArray !== null && elementArray !== undefined) {
                NewContent = NewContent + elementString + '\n\n';
            }
        }
        content = content + '\n\n' + NewContent;
    }
    catch (mensage) {
        console.log(mensage);
    }
}
textarea.addEventListener("input", (event) => {
    const targetElement = event.target;
    content = String(targetElement.textContent);
});
textarea.addEventListener('blur', handleBlur);
textarea.addEventListener('focus', handleFocus);
textarea.addEventListener('keydown', HandleEditorElements);
textarea.addEventListener('input', handleFormaterCharacteres);
textarea.addEventListener('click', handleSelectionElement);
textarea.addEventListener('paste', handleClearPaste);
function handleFormaterCharacteres(Event) {
    const regex = /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm;
    const Div = Event.target;
    if (regex.test(String(Div.textContent))) {
        Div.classList.add('title');
    }
    else {
        Div.classList.remove('title');
    }
}
function handleFocus(event) {
    const div = event.target;
    if (div.textContent.trim() === '') {
        div.classList.remove('placeholder');
    }
}
function handleBlur(event) {
    const div = event.target;
    if (div.textContent.trim() === '') {
        div.classList.add('placeholder');
    }
}
function isCursorAtEnd(element) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0)
        return false;
    const range = selection.getRangeAt(0);
    const endNode = range.endContainer;
    const endOffset = range.endOffset;
    if (endNode.nodeType === Node.TEXT_NODE) {
        return endOffset === (endNode.nodeValue ? endNode.nodeValue.length : 0);
    }
    return endOffset === element.childNodes.length;
}
function handleClearPaste(e) {
    var _a;
    e.preventDefault();
    const pasteContent = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
    if (!pasteContent) {
        console.log('No text content to paste.');
        return;
    }
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode(pasteContent));
    const div = e.target;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(fragment);
        selection.removeAllRanges();
    }
    else {
        div.textContent = pasteContent;
    }
}
function HandleEditorElements(e) {
    const div = e.target;
    if (e.key === 'Enter') {
        if (isCursorAtEnd(div)) {
            e.preventDefault();
            const newElement = document.createElement('div');
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                newElement.className = 'text_area_darkmode editable';
            }
            else {
                newElement.className = 'text_area editable';
            }
            newElement.contentEditable = 'true';
            newElement.addEventListener('keydown', HandleEditorElements);
            newElement.addEventListener('keydown', DeleteElement);
            newElement.addEventListener('input', handleFormaterCharacteres);
            newElement.addEventListener('click', handleSelectionElement);
            newElement.addEventListener('paste', handleClearPaste);
            newElement.innerHTML = '';
            e.target.insertAdjacentElement('afterend', newElement);
            newElement.focus();
        }
    }
}
function DeleteElement(event) {
    var _a;
    if (event.target && event.target instanceof HTMLElement) {
        const target = event.target;
        if (event.key === 'Backspace' && ((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === '') {
            target.removeEventListener('keydown', HandleEditorElements);
            target.removeEventListener('keydown', DeleteElement);
            target.removeEventListener('input', handleFormaterCharacteres);
            target.removeEventListener('click', handleSelectionElement);
            target.removeEventListener('paste', handleClearPaste);
            if (target.previousElementSibling && 'focus' in target.previousElementSibling) {
                target.previousElementSibling.focus();
                moveCursorToEndOfLine(target.previousElementSibling);
            }
            main.removeChild(event.target);
        }
    }
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
//# sourceMappingURL=editor.js.map