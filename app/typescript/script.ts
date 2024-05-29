import { checkMode } from "./darkmode.js";
import { switchMode } from "./darkmode.js";
const switchButton = document.querySelector(
  "#switchButton"
) as HTMLButtonElement;

checkMode();

switchButton.addEventListener("click", () => {
  switchMode();
});
