const textarea = document.querySelector("#content");
const main = document.querySelector("#container_main");
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
function HandleEditorElements(e) {
    if (e.key === 'Enter') {
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
        newElement.innerHTML = '';
        e.target.insertAdjacentElement('afterend', newElement);
        newElement.focus();
    }
}
function DeleteElement(event) {
    var _a;
    if (event.target && event.target instanceof HTMLElement) {
        const target = event.target;
        if (event.key === 'Backspace' && ((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === '') {
            target.removeEventListener('keydown', HandleEditorElements);
            target.removeEventListener('keydown', DeleteElement);
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