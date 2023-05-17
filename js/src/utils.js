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
    textValue = el.options[el.selectedIndex].innerText;
  } else {
    if (has(el, "inputmask")) {
      textValue = el.inputmask.undoValue;
    } else {
      if (el.getAttribute("type") == "date") {
        if (el.value) {
          textValue = new Date(...el.value.split("-")).toLocaleDateString();
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
        z-index: 100;
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
    `;
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
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

export { gettext };
