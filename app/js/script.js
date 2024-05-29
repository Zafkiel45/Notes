import { checkMode } from "./darkmode.js";
import { switchMode } from "./darkmode.js";
const switchButton = document.querySelector("#switchButton");
checkMode();
switchButton.addEventListener("click", () => {
    switchMode();
});
//# sourceMappingURL=script.js.map