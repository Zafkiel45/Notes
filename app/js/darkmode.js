"use strict";
const body = document.querySelector(".container_master");
const svgElements = document.querySelectorAll(".svgs");
const navbar = document.querySelector(".container_buttons_nav_header");
const switchButton = document.querySelector("#switchButton");
const DIV_ELEMENT_DARKMODE = "text_area_darkmode";
const SVG_ELEMENT_DARKMODE = "svgs_darkmode";
const NAV_ELEMENT_DARKMODE = "container_buttons_nav_header_darkmode";
const BODY_ELEMENT_DARKMODE = "container_master_darkmode";
const SVG_ELEMENT_LIGHTMODE = "svgs";
const DIV_ELEMENT_LIGHTMODE = "text_area";
const NAV_ELEMENT_LIGHTMODE = "container_buttons_nav_header";
const BODY_ELEMENT_LIGHTMODE = "container_master";
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
      UniqueElements(navbar, NAV_ELEMENT_DARKMODE, NAV_ELEMENT_LIGHTMODE);
      MultplesElements(
        updateElementAreas(),
        DIV_ELEMENT_DARKMODE,
        DIV_ELEMENT_LIGHTMODE,
      );
      MultplesElements(
        svgElements,
        SVG_ELEMENT_DARKMODE,
        SVG_ELEMENT_LIGHTMODE,
      );
    } else {
      UniqueElements(body, BODY_ELEMENT_LIGHTMODE, BODY_ELEMENT_DARKMODE);
      UniqueElements(navbar, NAV_ELEMENT_LIGHTMODE, NAV_ELEMENT_DARKMODE);
      MultplesElements(
        updateElementAreas(),
        DIV_ELEMENT_LIGHTMODE,
        DIV_ELEMENT_DARKMODE,
      );
      MultplesElements(
        svgElements,
        SVG_ELEMENT_LIGHTMODE,
        SVG_ELEMENT_DARKMODE,
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
//# sourceMappingURL=darkmode.js.map
