const body = document.querySelector(".container_master");
const header = document.querySelector("#header");
const svgs = document.querySelectorAll(".svgs");
const buttons_nav = document.querySelector("#container_buttons_nav_header");
const switchButton = document.querySelector("#switchButton");
const DIV_ELEMENT_DARKMODE = "text_area_darkmode";
const BODY_ELEMENT_DARKMODE = "container_master_darkmode";
const DIV_ELEMENT_LIGHTMODE = "text_area";
const BODY_ELEMENT_LIGHTMODE = "container_master";
const HEADER_ELEMENT_DARKMODE = "container_header_darkmode";
const HEADER_ELEMENT_LIGHTMODE = "container_header";
const SVG_ELEMENT_DARKMODE = "svgs_darkmode";
const SVG_ELEMENT_LIGHTKMODE = "svgs";
const BUTTON_ELEMENT_DARKMODE = "container_buttons_nav_header_darkmode";
const BUTTON_ELEMENT_LIGHTMODE = "container_buttons_nav_header";
function updateElementAreas() {
  return document.querySelectorAll(".text_area, .text_area_darkmode");
}
function checkMode() {
  const preferenceTheme = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  localStorage.theme = preferenceTheme ? "dark" : "light";
  updateElements();
}
function MultplesElements(elements, ClassAdd, ClassRemove) {
  elements.forEach((item) => {
    item.classList.remove(ClassRemove);
    item.classList.add(ClassAdd);
  });
}
function UniqueElements(element, ClassAdd, ClassRemove) {
  element.classList.remove(ClassRemove);
  element.classList.add(ClassAdd);
}
function updateElements() {
  try {
    if (!localStorage.theme) {
      throw new Error('Erro ao obter o "theme" no LocalStorage');
    }
    localStorage.theme = localStorage.theme === "dark" ? "light" : "dark";
    if (localStorage.theme === "dark") {
      UniqueElements(body, BODY_ELEMENT_DARKMODE, BODY_ELEMENT_LIGHTMODE);
      UniqueElements(header, HEADER_ELEMENT_DARKMODE, HEADER_ELEMENT_LIGHTMODE);
      MultplesElements(
        updateElementAreas(),
        DIV_ELEMENT_DARKMODE,
        DIV_ELEMENT_LIGHTMODE,
      );
      MultplesElements(svgs, SVG_ELEMENT_DARKMODE, SVG_ELEMENT_LIGHTKMODE);
      UniqueElements(
        buttons_nav,
        BUTTON_ELEMENT_DARKMODE,
        BUTTON_ELEMENT_LIGHTMODE,
      );
    } else {
      UniqueElements(body, BODY_ELEMENT_LIGHTMODE, BODY_ELEMENT_DARKMODE);
      UniqueElements(header, HEADER_ELEMENT_LIGHTMODE, HEADER_ELEMENT_DARKMODE);
      MultplesElements(
        updateElementAreas(),
        DIV_ELEMENT_LIGHTMODE,
        DIV_ELEMENT_DARKMODE,
      );
      MultplesElements(svgs, SVG_ELEMENT_LIGHTKMODE, SVG_ELEMENT_DARKMODE);
      UniqueElements(
        buttons_nav,
        BUTTON_ELEMENT_LIGHTMODE,
        BUTTON_ELEMENT_DARKMODE,
      );
    }
  } catch (mensage) {
    window.alert(mensage);
  }
}
switchButton.addEventListener("click", () => {
  updateElements();
});
checkMode();
