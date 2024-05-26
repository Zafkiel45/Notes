const body = document.querySelector('.container_master') as HTMLBodyElement;
let darkmode: boolean | undefined;

export function checkMode():void {
    console.log('checked')
    if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark')
        darkmode = true;
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        darkmode = false;
    }
}

export function switchMode() {
    console.log("swichted")
    darkmode = !darkmode;
    if(darkmode) {
        body.classList.remove('container_master');
        body.classList.add('container_master_darkmode');
    } else {
        body.classList.remove('container_master_darkmode');
        body.classList.add('container_master');
    }
}