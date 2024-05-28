const textarea = document.querySelectorAll(".textarea textarea_darkmode"); 
const link = document.querySelector("#link") as HTMLAnchorElement;
const export_button = document.querySelector(
  "#export_button"
) as HTMLButtonElement;
const bold_button = document.querySelector("#bold_button") as HTMLButtonElement;
const italic_button = document.querySelector("#italic_button") as HTMLButtonElement;
const list_button = document.querySelector("#list_button") as HTMLButtonElement;
const code_button = document.querySelector("#code_button") as HTMLButtonElement;
import { Formater } from "./convert.js";
let elementFocus: HTMLDivElement | null = null; 

function handleConvertElementsInDiv() {
  const elementsWithContentEditable = document.querySelectorAll<HTMLDivElement>('div[contenteditable]');
 
  elementsWithContentEditable.forEach((item) => {
    if(item.classList.contains('selected')) {
      elementFocus = item;
    } else {
      console.log('nenhum elemento focado')
    }
  })
}
export function handleSelectionElement(e: Event) {
  const elementsWithContentEditable = document.querySelectorAll<HTMLDivElement>('div[contenteditable]');
  const div = e.target as HTMLDivElement;

  elementsWithContentEditable.forEach((item) => {
    if(item.classList.contains('selected')) {
      item.classList.remove('selected')
    }
  });

 div.classList.add('selected'); 
}
// formater buttons
bold_button.addEventListener("click", () => {
  handleConvertElementsInDiv()
  if(elementFocus) {
    elementFocus.innerHTML = elementFocus.innerHTML + '**text**'
  } else {
    console.log('elemento é nulo!')
  }
})
italic_button.addEventListener('click', () => {
  handleConvertElementsInDiv()
  if(elementFocus) {
    elementFocus.innerHTML = elementFocus.innerHTML + '__text__'
  } else {
    console.log('elemento é nulo!')
  }
})
code_button.addEventListener('click', () => {
  handleConvertElementsInDiv()
  if(elementFocus) {
    elementFocus.innerHTML = elementFocus.innerHTML + '<br>```javascript```';
  } else {
    console.log('elemento é nulo!')
  }
})
list_button.addEventListener('click', () => {
  handleConvertElementsInDiv()
  if(elementFocus) {
    elementFocus.innerHTML = elementFocus.innerHTML + '\n-'
  } else {
    console.log('elemento é nulo!')
  }
})

// export 
function ExportFile(markdown:string):void {

  let blob:Blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  let url:string = URL.createObjectURL(blob);

  link.href = url;
  link.download = "document.md";

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}

export_button.addEventListener("click", () => {
  ExportFile(Formater());
});
