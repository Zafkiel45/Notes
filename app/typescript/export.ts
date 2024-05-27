const textarea = document.querySelector("#content") as HTMLTextAreaElement;
const link = document.querySelector("#link") as HTMLAnchorElement;
const export_button = document.querySelector(
  "#export_button"
) as HTMLButtonElement;
const bold_button = document.querySelector("#bold_button") as HTMLButtonElement;
const italic_button = document.querySelector("#italic_button") as HTMLButtonElement;
const list_button = document.querySelector("#list_button") as HTMLButtonElement;
const code_button = document.querySelector("#code_button") as HTMLButtonElement;

let content: string;

bold_button.addEventListener("click", () => {
    textarea.value = textarea.value + '**text**';
})
italic_button.addEventListener('click', () => {
    textarea.value = textarea.value + '__text__';
})
code_button.addEventListener('click', () => {
  textarea.value = textarea.value + '\n```js\n```'
})
list_button.addEventListener('click', () => {
  textarea.value = textarea.value + '\n-'
})
textarea.addEventListener("change", (event: Event) => {
  const targetElement = event.target as HTMLTextAreaElement;
  content = targetElement.value;
});

function Formater():void {
  function conversion(text: string, pattern: RegExp, replacement: string):string {
    return text.replace(pattern, replacement);
  }
  function titleConversion(text: string, pattern: RegExp, replacement: string):string {
    return text.replace(pattern, function (match:string) {
        const matchResult = match.trim().match(/^#+/);
        if (matchResult) {
          const level = matchResult[0].length;  // Conta o número de '#'
          return `${replacement.repeat(level)} ${match.trim().substring(level).trim()}`;
        }
        return match;  // Retorna o match original se não encontrar '#'
    });
  }

  let markdown = conversion(content, /\*\*(.*?)\*\*/g, "**$1**");
  markdown = conversion(markdown, /__(.*?)__/g, "__$1__");
  markdown = titleConversion(
    markdown,
    /^#{1,6}\s[a-zA-Z0-9\s\-\_\.,]+\s*$/gm,
    "#"
  );

  let blob:Blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  let url = URL.createObjectURL(blob);

  link.href = url;
  link.download = "document.md";

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}

export_button.addEventListener("click", () => {
  Formater();
});
