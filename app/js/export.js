"use strict";
const textarea = document.querySelector('#content');
const link = document.querySelector("#link");
const export_button = document.querySelector('#export_button');
let content;
textarea.addEventListener('change', (event) => {
    const targetElement = event.target;
    content = targetElement.value;
});
function Formater() {
    function conversion(text, pattern, replacement) {
        return text.replace(pattern, replacement);
    }
    function titleConversion(text, pattern, replacement) {
        return text.replace(pattern, function (match, p1) { return replacement + 1; });
    }
    let markdown = conversion(content, /\*\*(.*?)\*\*/g, '**$1**');
    markdown = conversion(markdown, /__(.*?)__/g, '__$1__');
    markdown = titleConversion(markdown, /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm, '');
    let blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    let url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'document.md';
    link.click();
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 100);
}
export_button.addEventListener('click', () => {
    Formater();
});
//# sourceMappingURL=export.js.map