const body = document.querySelector('.container_master');
const textarea = document.querySelector('#content');
let darkmode;
export function checkMode() {
    console.log('checked');
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        darkmode = true;
    }
    else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        darkmode = false;
    }
    updateElements();
}
export function switchMode() {
    console.log("swichted");
    darkmode = !darkmode;
    updateElements();
}
function updateElements() {
    if (darkmode) {
        body.classList.remove('container_master');
        body.classList.add('container_master_darkmode');
        textarea.classList.remove('text_area');
        textarea.classList.add('text_area_darkmode');
    }
    else {
        body.classList.remove('container_master_darkmode');
        body.classList.add('container_master');
        textarea.classList.remove('text_area_darkmode');
        textarea.classList.add('text_area');
    }
}
//# sourceMappingURL=darkmode.js.map