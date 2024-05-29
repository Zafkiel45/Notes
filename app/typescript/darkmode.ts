const body = document.querySelector(".container_master") as HTMLBodyElement;
const navbar = document.querySelector(
  ".container_buttons_nav_header"
) as HTMLDivElement;
const svgs = document.querySelectorAll(".svgs");

const svgElements: SVGAElement[] = Array.from(svgs).map(
  (svg) => svg as SVGAElement
);
let darkmode: boolean | undefined;

function updateElementAreas() {
  const textarea = document.querySelectorAll(".text_area, .text_area_darkmode");
  return Array.from(textarea).map((item) => item as HTMLDivElement);
}

export function checkMode(): void {
 
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    darkmode = true;
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    darkmode = false;
  }
  updateElements();
}

export function switchMode() {
  darkmode = !darkmode;
  updateElements();
}
function updateElements(): void {
  const ElementArea = updateElementAreas();

  if (darkmode) {
    body.classList.remove("container_master");
    body.classList.add("container_master_darkmode");
    ElementArea.forEach((item) => {
      item.classList.remove("text_area");
      item.classList.add("text_area_darkmode");
    });
    navbar.classList.remove("container_buttons_nav_header");
    navbar.classList.add("container_buttons_nav_header_darkmode");
    svgElements.forEach((item) => {
      item.classList.remove("svgs");
      item.classList.add("svgs_darkmode");
    });
  } else {
    body.classList.remove("container_master_darkmode");
    body.classList.add("container_master");
    ElementArea.forEach((item) => {
      item.classList.remove("text_area_darkmode");
      item.classList.add("text_area");
    });
    navbar.classList.remove("container_buttons_nav_header_darkmode");
    navbar.classList.add("container_buttons_nav_header");
    svgElements.forEach((item) => {
      item.classList.remove("svgs_darkmode");
      item.classList.add("svgs");
    });
    ElementArea.forEach((item) => {
      item.classList.remove("text_area_darkmode");
      item.classList.add("text_area");
    });
  }
}
