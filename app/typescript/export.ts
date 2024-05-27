const textarea = document.querySelector("#content") as HTMLDivElement; 
const container_main = document.querySelector("#container_main") as HTMLDivElement;
const link = document.querySelector("#link") as HTMLAnchorElement;
const export_button = document.querySelector(
  "#export_button"
) as HTMLButtonElement;
const bold_button = document.querySelector("#bold_button") as HTMLButtonElement;
const italic_button = document.querySelector("#italic_button") as HTMLButtonElement;
const list_button = document.querySelector("#list_button") as HTMLButtonElement;
const code_button = document.querySelector("#code_button") as HTMLButtonElement;

let content: string;

// formater buttons
bold_button.addEventListener("click", () => {
    textarea.innerText = textarea.innerText + '**text**';
})
italic_button.addEventListener('click', () => {
    textarea.innerText = textarea.innerText + '__text__';
})
code_button.addEventListener('click', () => {
  textarea.innerText = textarea.innerText + '\n```js\n```'
})
list_button.addEventListener('click', () => {
  textarea.innerText = textarea.innerText + '\n-'
})
// editor
textarea.addEventListener("input", (event: Event) => {
  const targetElement = event.target as HTMLDivElement;
  content = String(targetElement.textContent);
});
textarea.addEventListener('blur', handleBlur);
textarea.addEventListener('focus', handleFocus);
textarea.addEventListener('keydown', HandleEditorElements);

function HandleEditorElements(e: KeyboardEvent) {
  if(e.key === 'Enter') {
    e.preventDefault();
    const newElement = document.createElement('div');
    
    if(window.matchMedia("(prefers-color-scheme: dark)").matches){
      newElement.className = 'text_area_darkmode';
    } else {
      newElement.className = 'text_area';
    }

    newElement.contentEditable = 'true';
    newElement.addEventListener('keydown', HandleEditorElements);
    newElement.innerHTML = '';

    (e.target as HTMLDivElement).insertAdjacentElement('afterend', newElement);
    newElement.focus();
  }
}
function handleFocus(event: any) {
  const div = event.target;
  if (div.textContent.trim() === '') {
    div.classList.remove('placeholder');
  }
}

function handleBlur(event: any) {
  const div = event.target;
  if (div.textContent.trim() === '') {
    div.classList.add('placeholder');
  }
}
// export 
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
