import { HandleItalicFormaterKeyDown, HandleBoldFormaterKeyDown, } from "./formater_buttons.js";
const textarea = document.querySelector("#content");
const main = document.querySelector("#container_main");
export let content;
export function HandleElementContent() {
    try {
        const Editables = main.querySelectorAll(".editable");
        if (!Editables || !main) {
            throw Error("Lista de Editables vazia");
        }
        let NewContent = "";
        Editables.forEach((editable) => {
            var _a;
            const elementString = (_a = editable.textContent) !== null && _a !== void 0 ? _a : "";
            NewContent += elementString + "\n\n";
        });
        return (content = String(content + "\n\n" + NewContent));
    }
    catch (mensage) {
        console.log(mensage);
    }
}
export function ClearContentElement() {
    content = "";
}
textarea.addEventListener("input", (event) => {
    var _a;
    content = (_a = String(event.target.textContent)) !== null && _a !== void 0 ? _a : "";
});
textarea.addEventListener("blur", handleBlur);
textarea.addEventListener("focus", handleFocus);
textarea.addEventListener("keydown", HandleEditorElements);
textarea.addEventListener("keydown", HandleItalicFormaterKeyDown);
textarea.addEventListener("keydown", HandleBoldFormaterKeyDown);
textarea.addEventListener("input", handleFormatterCharacters);
textarea.addEventListener("click", handleSelectionElement);
textarea.addEventListener("paste", handleClearPaste);
export function handleFormatterCharacters(Event) {
    const regex = /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm;
    const targetElement = Event.target;
    const targetElementTextoContent = String(targetElement.textContent);
    if (regex.test(targetElementTextoContent) && targetElement) {
        targetElement.classList.remove("title", "title_2", "title_3");
        const titleLevelMatch = targetElementTextoContent.match(/^#+/);
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
        targetElement.classList.remove("title", "title_2", "title_3");
    }
}
function handleFocus(event) {
    const div = event.target;
    const div_textContent = String(div.textContent);
    if (div_textContent.trim() === "") {
        div.classList.remove("placeholder");
    }
}
function handleBlur(event) {
    const div = event.target;
    const div_textContent = String(div.textContent);
    if (div_textContent.trim() === "") {
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
    }
    else {
        div.innerHTML = pasteContent;
        div.focus();
        moveCursorToEndOfLine(div);
    }
}
export function handleCurrentSelectionElement() {
    const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
    elementsWithContentEditable.forEach((item) => {
        if (item.classList.contains("selected")) {
            item.classList.remove("selected");
        }
    });
}
function handleSelectionElement(e) {
    const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
    const div = e.target;
    elementsWithContentEditable.forEach((item) => {
        if (item.classList.contains("selected")) {
            item.classList.remove("selected");
        }
    });
    div.classList.add("selected");
}
export function HandleEditorElements(e) {
    const div = e.target;
    if (e.key === "Enter" && isCursorAtEnd(div)) {
        e.preventDefault();
        const newElement = document.createElement("div");
        const currentTheme = localStorage.theme;
        newElement.className =
            currentTheme === "dark"
                ? "text_area_darkmode editable"
                : "text_area editable";
        newElement.contentEditable = "true";
        newElement.addEventListener("keydown", HandleEditorElements);
        newElement.addEventListener("keydown", DeleteElement);
        newElement.addEventListener("input", handleFormatterCharacters);
        newElement.addEventListener("click", handleSelectionElement);
        newElement.addEventListener("paste", handleClearPaste);
        newElement.addEventListener("keydown", HandleItalicFormaterKeyDown);
        newElement.addEventListener("keydown", HandleBoldFormaterKeyDown);
        newElement.innerHTML = "";
        handleCurrentSelectionElement();
        newElement.classList.add("selected");
        div.insertAdjacentElement("afterend", newElement);
        newElement.focus();
    }
    else {
        console.log("não está no fim da linha!");
    }
}
export function DeleteElement(event) {
    var _a, _b;
    if (event.target && event.target instanceof HTMLElement) {
        const target = event.target;
        if (event.key === "Backspace" && ((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "") {
            removeEventListenersFromEditable(target);
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
function removeEventListenersFromEditable(element) {
    element.removeEventListener("keydown", HandleEditorElements);
    element.removeEventListener("keydown", DeleteElement);
    element.removeEventListener("input", handleFormatterCharacters);
    element.removeEventListener("click", handleSelectionElement);
    element.removeEventListener("paste", handleClearPaste);
    element.removeEventListener("keydown", HandleItalicFormaterKeyDown);
    element.removeEventListener("keydown", HandleBoldFormaterKeyDown);
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