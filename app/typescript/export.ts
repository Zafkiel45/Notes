const link = document.querySelector("#link") as HTMLAnchorElement;
const main = document.querySelector('#container_main') as HTMLDivElement;
const export_button = document.querySelector(
  "#export_button"
) as HTMLButtonElement;
const bold_button = document.querySelector("#bold_button") as HTMLButtonElement;
const italic_button = document.querySelector(
  "#italic_button"
) as HTMLButtonElement;
const list_button = document.querySelector("#list_button") as HTMLButtonElement;
const code_button = document.querySelector("#code_button") as HTMLButtonElement;

import { Formater } from "./convert.js";
import { HandleEditorElements, DeleteElement, handleClearPaste, handleFormatterCharacters, isCursorAtEnd } from "./editor.js";
let elementFocus: HTMLDivElement | null = null;

function handleConvertElementsInDiv() {
  const elementsWithContentEditable = document.querySelectorAll<HTMLDivElement>(
    "div[contenteditable]"
  );

  elementsWithContentEditable.forEach((item) => {
    if (item.classList.contains("selected")) {
      elementFocus = item;
    } else {
      console.log("nenhum elemento focado");
    }
  });
}
export function handleSelectionElement(e: Event) {
  const elementsWithContentEditable = document.querySelectorAll<HTMLDivElement>(
    "div[contenteditable]"
  );
  const div = e.target as HTMLDivElement;

  elementsWithContentEditable.forEach((item) => {
    if (item.classList.contains("selected")) {
      item.classList.remove("selected");
    }
  });

  div.classList.add("selected");
}
// formater buttons
bold_button.addEventListener("click", () => {
  handleConvertElementsInDiv();
  if (elementFocus) {
    elementFocus.innerHTML = elementFocus.innerHTML + "**text**";
  } else {
    console.log("elemento é nulo!");
  }
});
italic_button.addEventListener("click", () => {
  handleConvertElementsInDiv();
  if (elementFocus) {
    elementFocus.innerHTML = elementFocus.innerHTML + "__text__";
  } else {
    console.log("elemento é nulo!");
  }
});
code_button.addEventListener("click", (e) => {
  const NewDiv = document.createElement('div');
  const NewPre = document.createElement('pre');
  const NewHeader = document.createElement('header');
  const NewButton = document.createElement('button');
  const elementsWithContentEditable = document.querySelectorAll<HTMLDivElement>(
    "div[contenteditable]"
  );
  let TargetElement: Element;

  NewDiv.className = 'code_block_container'
  NewPre.className = 'code_block editable';
  NewPre.contentEditable = 'true';
  NewHeader.className = 'code_block_header';
  NewButton.className = 'button_code_delete';
  NewButton.textContent = 'Delete Button';
  NewPre.textContent = '```javascript\n\n\n```'

  NewButton.addEventListener('click', (button) => {
    const AllContainersBlocks = document.querySelectorAll('.code_block_container');
    const AllContainersBlocksDiv: HTMLDivElement[] = Array.from(AllContainersBlocks)
      .map(item => item as HTMLDivElement);
    AllContainersBlocksDiv.forEach((item) => {
      if(item.contains(button.target as HTMLButtonElement)) {
        item.remove()
      } else {
        console.log('Nenhum elemento encontrado!')
      }
    })
  })

  NewPre.addEventListener('keydown', handleElementsInPre)

  function handleElementsInPre(e: KeyboardEvent) {
    if(e.key === 'Enter' && isCursorAtEnd(e.target as HTMLDivElement)) {
      e.preventDefault();
      const newElement = document.createElement("div");

      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        newElement.className = "text_area_darkmode editable";
      } else {
        newElement.className = "text_area editable";
      }

      newElement.contentEditable = "true";
      newElement.addEventListener("keydown", HandleEditorElements);
      newElement.addEventListener("keydown", DeleteElement);
      newElement.addEventListener("input", handleFormatterCharacters);
      newElement.addEventListener("click", handleSelectionElement);
      newElement.addEventListener("paste", handleClearPaste);

      newElement.innerHTML = "";

      elementsWithContentEditable.forEach((item) => {
        if(item.classList.contains('selected')) {
          item.classList.remove('selected');
        }
      });

      newElement.classList.add('selected');

      (NewDiv as HTMLDivElement).insertAdjacentElement(
        "afterend",
        newElement
      );

      newElement.focus();
    }
  }
  NewDiv.appendChild(NewHeader);
  NewDiv.appendChild(NewPre);
  NewHeader.appendChild(NewButton);

  elementsWithContentEditable.forEach((item) => {
    if(item.classList.contains('selected')) {
      console.log(item)
      TargetElement = item;
      (TargetElement as HTMLDivElement).insertAdjacentElement(
        "afterend",
        NewDiv
      );
      NewPre.focus();
    }
  })
});

list_button.addEventListener("click", () => {
  handleConvertElementsInDiv();
  if (elementFocus) {
    elementFocus.innerHTML = elementFocus.innerHTML + "\n-";
  } else {
    console.log("elemento é nulo!");
  }
});

// export
function ExportFile(markdown: string): void {
  let blob: Blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8",
  });
  let url: string = URL.createObjectURL(blob);

  link.href = url;
  link.download = "document.md";

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}

export_button.addEventListener("click", () => {
  ExportFile(Formater());
});
