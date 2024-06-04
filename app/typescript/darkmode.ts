const body = document.querySelector(".container_master") as HTMLBodyElement;
const svgElements = document.querySelectorAll(".svgs");
const navbar = document.querySelector(
  ".container_buttons_nav_header",
) as HTMLDivElement;
const switchButton = document.querySelector(
  "#switchButton",
) as HTMLButtonElement;

const DIV_ELEMENT_DARKMODE: string = "text_area_darkmode";
const SVG_ELEMENT_DARKMODE: string = "svgs_darkmode";
const NAV_ELEMENT_DARKMODE: string = "container_buttons_nav_header_darkmode";
const BODY_ELEMENT_DARKMODE: string = "container_master_darkmode";
const SVG_ELEMENT_LIGHTMODE: string = "svgs";
const DIV_ELEMENT_LIGHTMODE: string = "text_area";
const NAV_ELEMENT_LIGHTMODE: string = "container_buttons_nav_header";
const BODY_ELEMENT_LIGHTMODE: string = "container_master";

function updateElementAreas() {
  return document.querySelectorAll(".text_area, .text_area_darkmode");
}

function checkMode(): void {
  const preferenceTheme = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  localStorage.theme = preferenceTheme ? "dark" : "light";

  updateElements();
}

function MultplesElements(
  elements: NodeList,
  ClassAdd: string,
  ClassRemove: string,
): void {
  elements.forEach((item) => {
    (item as HTMLElement).classList.remove(ClassRemove);
    (item as HTMLElement).classList.add(ClassAdd);
  });
}
function UniqueElements(
  element: HTMLElement,
  ClassAdd: string,
  ClassRemove: string,
): void {
  element.classList.remove(ClassRemove);
  element.classList.add(ClassAdd);
}

function updateElements(): void {
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
