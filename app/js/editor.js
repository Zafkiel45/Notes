const textarea = document.querySelector("#content");
const main = document.querySelector("#container_main");
import { handleSelectionElement } from "./export.js";
import { HandleItalicFormaterKeyDown, HandleBoldFormaterKeyDown } from "./formater_buttons.js";
export let content;
export function HandleElementContent() {
    var _a;
    try {
        const Editables = main.querySelectorAll(".editable");
        if (!Editables || !main) {
            throw Error("Lista de Editables vazia");
        }
        const EditableArray = Array.from(Editables).map((item) => item);
        let NewContent = "";
        for (let c = 0; c < EditableArray.length; c++) {
            const elementArray = EditableArray[c];
            const elementString = (_a = elementArray.textContent) !== null && _a !== void 0 ? _a : "";
            if (elementArray !== null && elementArray !== undefined) {
                NewContent = NewContent + elementString + "\n\n";
            }
        }
        content = content + "\n\n" + NewContent;
    }
    catch (mensage) {
        console.log(mensage);
    }
}
export function ClearContentElement() {
    content = '';
}
textarea.addEventListener("input", (event) => {
    const targetElement = event.target;
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
export function handleFormatterCharacters(Event) {
    var _a;
    const regex = /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm;
    const targetElement = Event.target;
    if (regex.test(String(targetElement.textContent)) && targetElement) {
        targetElement.classList.remove("title", "title_2", "title_3");
        const titleLevelMatch = (_a = String(targetElement.textContent)) === null || _a === void 0 ? void 0 : _a.match(/^#+/);
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
    }
    else {
        targetElement.classList.remove("title");
    }
}
function handleFocus(event) {
    const div = event.target;
    if (div.textContent.trim() === "") {
        div.classList.remove("placeholder");
    }
}
function handleBlur(event) {
    const div = event.target;
    if (div.textContent.trim() === "") {
        div.classList.add("placeholder");
    }
}
export function isCursorAtEnd(element) {
    var _a;
    const selection = window.getSelection();
    const nodeList = element.lastChild;
    if (!selection || selection.rangeCount === 0)
        return false;
    const range = selection.getRangeAt(0);
    const endNode = range.endContainer;
    const endOffset = range.endOffset;
    if (endNode.nodeType === endNode.TEXT_NODE) {
        return endOffset === ((_a = nodeList === null || nodeList === void 0 ? void 0 : nodeList.textContent) === null || _a === void 0 ? void 0 : _a.length);
    }
    return endOffset === element.childNodes.length;
}
export function handleClearPaste(e) {
    var _a;
    e.preventDefault();
    let pasteContent = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.getData("text/plain");
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
    const div = e.target;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(fragment);
        selection.removeAllRanges();
        div.focus();
        moveCursorToEndOfLine(div);
    }
    else {
        div.innerHTML = pasteContent;
        div.focus();
        moveCursorToEndOfLine(div);
    }
}
export function HandleEditorElements(e) {
    const div = e.target;
    if (e.key === "Enter") {
        if (isCursorAtEnd(div)) {
            e.preventDefault();
            const newElement = document.createElement("div");
            if (localStorage.theme === 'dark') {
                newElement.className = "text_area_darkmode editable";
            }
            else {
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
            const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
            elementsWithContentEditable.forEach((item) => {
                if (item.classList.contains('selected')) {
                    item.classList.remove('selected');
                }
            });
            newElement.classList.add('selected');
            e.target.insertAdjacentElement("afterend", newElement);
            newElement.focus();
        }
        else {
            console.log('não está no fim da linha!');
        }
    }
}
export function DeleteElement(event) {
    var _a, _b;
    if (event.target && event.target instanceof HTMLElement) {
        const target = event.target;
        if (event.key === "Backspace" && ((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "") {
            target.removeEventListener("keydown", HandleEditorElements);
            target.removeEventListener("keydown", DeleteElement);
            target.removeEventListener("input", handleFormatterCharacters);
            target.removeEventListener("click", handleSelectionElement);
            target.removeEventListener("paste", handleClearPaste);
            target.removeEventListener("keydown", HandleItalicFormaterKeyDown);
            target.removeEventListener("keydown", HandleBoldFormaterKeyDown);
            if (target.previousElementSibling &&
                "focus" in target.previousElementSibling) {
                target.previousElementSibling.focus();
                moveCursorToEndOfLine(target.previousElementSibling);
            }
            if (event.target.parentNode) {
                (_b = target.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(target);
            }
        }
    }
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
//# sourceMappingURL=editor.js.map