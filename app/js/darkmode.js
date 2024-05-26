const body = document.querySelector('.container_master');
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
}
export function switchMode() {
    console.log("swichted");
    darkmode = !darkmode;
    if (darkmode) {
        body.classList.remove('container_master');
        body.classList.add('container_master_darkmode');
    }
    else {
        body.classList.remove('container_master_darkmode');
        body.classList.add('container_master');
    }
}
//# sourceMappingURL=darkmode.js.map