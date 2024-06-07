let gettext = window.gettext;
const _has = Object.prototype.hasOwnProperty;
/**
 * Checks if the object has the property passed as argument
 */
export function has(object, key) {
  return _has.call(object, key);
}

export function uuidv4() {
  function randomHex() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  const part1 = randomHex() + randomHex();
  const part2 = randomHex();
  const part3 = ((parseInt(randomHex(), 16) & 0x0fff) | 0x4000).toString(16);
  const part4 = ((parseInt(randomHex(), 16) & 0x3fff) | 0x8000).toString(16);
  const part5 = randomHex() + randomHex() + randomHex();

  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

export function getTextValue(el) {
  let type = el.tagName.toLowerCase();
  let textValue = "";
  if (type === "select") {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = el.options[el.selectedIndex].innerText;
    textValue = tempDiv.innerText
      .split("\n")
      .map((item) => item.trim())
      .join(" ")
      .trim();
  } else {
    if (has(el, "inputmask")) {
      textValue = el.inputmask.undoValue;
    } else {
      if (el.getAttribute("type") == "date") {
        if (el.value) {
          textValue = el.value;
        }
      } else {
        if (el.getAttribute("type") == "checkbox") {
          textValue = el.checked ? "on" : "off";
        } else {
          textValue = el.value;
        }
      }
    }
  }
  return textValue;
}

export function getNumberValue(value) {
  return Number(value);
}

export function executeAllCalculatedFields() {
  if (window.hasOwnProperty("calculatedFields")) {
    calculatedFields.forEach(function (obj) {
      obj.executeAll();
    });
  }
}

export function hookCalculatedFields() {
  if (window.hasOwnProperty("calculatedFields")) {
    window.calculatedFields.forEach(function (obj) {
      let el = obj.field;
      let id = el.getAttribute("id");
      let column = document.querySelector("td[data-source='" + id + "']");
      if (column) {
        if (!el.hasAttribute("data-event")) {
          el.addEventListener("oncalculate", function () {
            let content = getTextValue(el);
            // The column element is refetched since the table is recreated on each event
            let _column = document.querySelector(
              "td[data-source='" + id + "']"
            );
            if (_column) {
              _column.innerText = content;
            }
          });
          el.setAttribute("data-event", true);
        }
      }
    });
  }
}

export function removeChildren(a) {
  while (a.hasChildNodes()) {
    a.removeChild(a.lastChild);
  }
}

export function injectStyles() {
  const styleId = "cfm-styles";
  if (!document.getElementById(styleId)) {
    const css = `
      .cfm-selection-border {
          position: absolute;
          top: 0px;
          bottom: 0px;
          left: 0px;
          width: 0.150rem;
          background-color: rgb(220 53 69 / 1);
      }
      .cfm-modal-backdrop {
          position: fixed;
          inset: 0px;
          z-index: 1050;
          background-color: rgb(31 41 55 / 1);
          opacity: 0;
          transition-property: opacity;
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }
      .cfm-opacity-50 {
          opacity: 0.5;
      }
      .cfm-opacity-100 {
          opacity: 1;
      }
      .cfm-tr.selected{
        background-color: rgba(0, 0, 0, 0.08) !important;
      }
      .cfm .modal-body {
        max-height: calc(100vh - 150px);
        overflow-x: auto;
      }
      .cfm-cursor-pointer {
        cursor: pointer;
      }
      [data-formset-form] .modal {
        z-index: 1051;
      }
      `;
    const style = document.createElement("style");
    style.innerHTML = css;
    style.id = styleId;
    document.head.appendChild(style);
  }
}

export function getModalInstance(id, instances) {
  if (instances.some((modalInstance) => modalInstance.id === id)) {
    return instances.find((modalInstance) => modalInstance.id === id);
  }
  return false;
}

export function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

if (!window.django || !window.django.jsi18n_initialized) {
  gettext = (msg) => msg;
}

const bootstrap4Classes = {
  hidden: "d-none",
  inlineFlex: "d-inline-flex",
  flex: "d-flex",
  relative: "position-relative",
  textRight: "text-right",
  textCenter: "text-center",
  alignMiddle: "align-middle",
  pointer: "cfm-cursor-pointer",
  checkbox: "checkbox",
  td: "cfm-td",
  tr: "cfm-tr",
  selectionMark: "cfm-selection-border",
  p0: "p-0",
  opacity50: "cfm-opacity-50",
  opacity100: "cfm-opacity-100",
  backdrop: "cfm-modal-backdrop",
  justifyStart: "justify-content-start",
  justifyCenter: "justify-content-center",
  justifyEnd: "justify-content-end",
  itemsStart: "align-items-start",
  itemsCenter: "align-items-center",
  itemsEnd: "align-items-end",
};

const bootstrap5Classes = {
  ...bootstrap4Classes,
  textRight: "text-end",
  checkbox: "checkbox form-check-input",
};

const tailwindClasses = {
  hidden: "hidden",
  inlineFlex: "inline-flex",
  flex: "flex",
  relative: "relative",
  textRight: "text-right",
  textCenter: "text-center",
  alignMiddle: "align-middle",
  pointer: "cursor-pointer",
  checkbox:
    "w-4 rounded border-gray-300 focus:ring-indigo-500 text-indigo-600 h-4",
  td: "whitespace-nowrap px-3 py-3 text-sm text-gray-500",
  tr: "divide-x divide-gray-200 border-b",
  selectionMark:
    "absolute inset-y-0 left-0 w-0.5 bg-indigo-600 selection-border",
  p0: "p-0",
  opacity50: "opacity-50",
  opacity100: "opacity-100",
  backdrop:
    "transition-opacity ease-in-out duration-300 opacity-0 bg-gray-800 fixed inset-0 z-40",
  justifyStart: "justify-start",
  justifyCenter: "justify-center",
  justifyEnd: "justify-end",
  itemsStart: "items-start",
  itemsCenter: "items-center",
  itemsEnd: "items-end",
};

const bulmaClasses = {
  hidden: "is-hidden",
  inlineFlex: "is-inline-flex",
  flex: "is-flex",
  relative: "is-relative",
  textRight: "has-text-right",
  textCenter: "has-text-center",
  alignMiddle: "is-vcentered",
  pointer: "cfm-cursor-pointer",
  checkbox: "checkbox",
  td: "cfm-td",
  tr: "cfm-tr",
  selectionMark: "cfm-selection-border",
  p0: "p-0",
  opacity50: "cfm-opacity-50",
  opacity100: "cfm-opacity-100",
  backdrop: "cfm-modal-backdrop",
  justifyStart: "is-justify-content-start",
  justifyCenter: "is-justify-content-center",
  justifyEnd: "is-justify-content-end",
  itemsStart: "is-align-items-start",
  itemsCenter: "is-align-items-center",
  itemsEnd: "is-align-items-end",
};

const tailwindSizeClasses = {
  sm: "max-w-lg",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
};

const bootstrap4SizeClasses = {
  sm: "modal-sm",
  md: "modal-md",
  lg: "modal-lg",
  xl: "modal-xl",
};

const bootstrap5SizeClasses = bootstrap4SizeClasses;

const bulmaSizeClasses = {
  sm: "modal-sm",
  md: "modal-md",
  lg: "modal-lg",
  xl: "modal-xl",
};

const templatePacks = {
  bootstrap4: {
    classes: bootstrap4Classes,
    sizes: bootstrap4SizeClasses,
  },
  bootstrap5: {
    classes: bootstrap5Classes,
    sizes: bootstrap5SizeClasses,
  },
  tailwind: {
    classes: tailwindClasses,
    sizes: tailwindSizeClasses,
  },
  bulma: {
    classes: bulmaClasses,
    sizes: bulmaSizeClasses,
  },
};

export { gettext, bootstrap4Classes, templatePacks };
