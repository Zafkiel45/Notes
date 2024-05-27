const textarea = document.querySelector("#content");
const main = document.querySelector("#container_main");
export let content;
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
            newElement.className = 'text_area_darkmode';
        }
        else {
            newElement.className = 'text_area';
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
    if (event.key === 'Backspace' && ((_a = event.target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === '') {
        event.target.removeEventListener('keydown', HandleEditorElements);
        event.target.removeEventListener('keydown', DeleteElement);
        main.removeChild(event.target);
    }
}
//# sourceMappingURL=editor.js.map