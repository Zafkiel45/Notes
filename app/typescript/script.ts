import { checkMode } from "./darkmode";
import { switchMode } from "./darkmode";
const switchButton = document.querySelector('#switchButton') as HTMLButtonElement;

checkMode();

switchButton.addEventListener('click', () => {
    switchMode();
})