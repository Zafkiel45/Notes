const body = document.querySelector('.container_master');
const textarea = document.querySelector('#content');
const navbar = document.querySelector('.container_buttons_nav_header');
const svgs = document.querySelectorAll('.svgs');
const svgElements = Array.from(svgs).map(svg => svg);
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
        navbar.classList.remove('container_buttons_nav_header');
        navbar.classList.add('container_buttons_nav_header_darkmode');
        svgElements.forEach((item) => {
            item.classList.remove('svgs');
            item.classList.add('svgs_darkmode');
        });
    }
    else {
        body.classList.remove('container_master_darkmode');
        body.classList.add('container_master');
        textarea.classList.remove('text_area_darkmode');
        textarea.classList.add('text_area');
        navbar.classList.remove('container_buttons_nav_header_darkmode');
        navbar.classList.add('container_buttons_nav_header');
        svgElements.forEach((item) => {
            item.classList.remove('svgs_darkmode');
            item.classList.add('svgs');
        });
    }
}
//# sourceMappingURL=darkmode.js.map