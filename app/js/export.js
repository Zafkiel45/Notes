const link = document.querySelector("#link");
const main = document.querySelector('#container_main');
const export_button = document.querySelector("#export_button");
const bold_button = document.querySelector("#bold_button");
const italic_button = document.querySelector("#italic_button");
const list_button = document.querySelector("#list_button");
const code_button = document.querySelector("#code_button");
import { Formater } from "./convert.js";
import { HandleEditorElements, DeleteElement, handleClearPaste, handleFormatterCharacters, isCursorAtEnd } from "./editor.js";
let elementFocus = null;
function handleConvertElementsInDiv() {
    const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
    elementsWithContentEditable.forEach((item) => {
        if (item.classList.contains("selected")) {
            elementFocus = item;
        }
        else {
            console.log("nenhum elemento focado");
        }
    });
}
export function handleSelectionElement(e) {
    const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
    const div = e.target;
    elementsWithContentEditable.forEach((item) => {
        if (item.classList.contains("selected")) {
            item.classList.remove("selected");
        }
    });
    div.classList.add("selected");
}
bold_button.addEventListener("click", () => {
    handleConvertElementsInDiv();
    if (elementFocus) {
        elementFocus.innerHTML = elementFocus.innerHTML + "**text**";
    }
    else {
        console.log("elemento é nulo!");
    }
});
italic_button.addEventListener("click", () => {
    handleConvertElementsInDiv();
    if (elementFocus) {
        elementFocus.innerHTML = elementFocus.innerHTML + "__text__";
    }
    else {
        console.log("elemento é nulo!");
    }
});
code_button.addEventListener("click", (e) => {
    const NewDiv = document.createElement('div');
    const NewPre = document.createElement('pre');
    const NewHeader = document.createElement('header');
    const NewButton = document.createElement('button');
    const elementsWithContentEditable = document.querySelectorAll("div[contenteditable]");
    let TargetElement;
    NewDiv.className = 'code_block_container';
    NewPre.className = 'code_block editable';
    NewPre.contentEditable = 'true';
    NewHeader.className = 'code_block_header';
    NewButton.className = 'button_code_delete';
    NewButton.textContent = 'Delete Button';
    NewPre.textContent = '```javascript\n\n\n```';
    NewButton.addEventListener('click', (button) => {
        const AllContainersBlocks = document.querySelectorAll('.code_block_container');
        const AllContainersBlocksDiv = Array.from(AllContainersBlocks)
            .map(item => item);
        AllContainersBlocksDiv.forEach((item) => {
            if (item.contains(button.target)) {
                item.remove();
            }
            else {
                console.log('Nenhum elemento encontrado!');
            }
        });
    });
    NewPre.addEventListener('keydown', handleElementsInPre);
    function handleElementsInPre(e) {
        if (e.key === 'Enter' && isCursorAtEnd(e.target)) {
            e.preventDefault();
            const newElement = document.createElement("div");
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
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
            newElement.innerHTML = "";
            elementsWithContentEditable.forEach((item) => {
                if (item.classList.contains('selected')) {
                    item.classList.remove('selected');
                }
            });
            newElement.classList.add('selected');
            NewDiv.insertAdjacentElement("afterend", newElement);
            newElement.focus();
        }
    }
    NewDiv.appendChild(NewHeader);
    NewDiv.appendChild(NewPre);
    NewHeader.appendChild(NewButton);
    elementsWithContentEditable.forEach((item) => {
        if (item.classList.contains('selected')) {
            console.log(item);
            TargetElement = item;
            TargetElement.insertAdjacentElement("afterend", NewDiv);
            NewPre.focus();
        }
    });
});
list_button.addEventListener("click", () => {
    handleConvertElementsInDiv();
    if (elementFocus) {
        elementFocus.innerHTML = elementFocus.innerHTML + "\n-";
    }
    else {
        console.log("elemento é nulo!");
    }
});
function ExportFile(markdown) {
    let blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8",
    });
    let url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "document.md";
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 100);
}
export_button.addEventListener("click", () => {
    ExportFile(Formater());
});
//# sourceMappingURL=export.js.map