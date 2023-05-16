import { uuidv4 } from "./utils";

const bootstrap4SizeClasses = {
  sm: "modal-sm",
  md: "modal-md",
  lg: "modal-lg",
  xl: "modal-xl",
};

const bootstrap5SizeClasses = bootstrap4SizeClasses;

const templatePacks = {
  bootstrap4: { sizes: bootstrap4SizeClasses },
  bootstrap5: { sizes: bootstrap5SizeClasses },
};

const modalDefault = {
  placement: "center",
  size: "md",
  backdropClasses: "cfm-modal-backdrop",
  templatePack: null,
  onHide: () => {},
  onShow: () => {},
  onToggle: () => {},
};

class Modal {
  constructor(targetEl = null, options = {}) {
    this._targetEl = targetEl;
    this._parentEl = targetEl.parentElement;
    this._options = {
      ...modalDefault,
      ...options,
    };
    this._isHidden = true;
    this._init();
    this._addEventListeners();
  }
  _init() {
    this._getPlacementClasses().map((c) => {
      this._targetEl.classList.add(c);
    });
    this._clearSize();
    this._getSizeClasses().map((c) => {
      this._targetEl.firstElementChild.classList.add(c);
    });
  }
  _createBackdrop(id) {
    if (this._isHidden) {
      const backdropEl = document.createElement("div");
      backdropEl.setAttribute("data-ref-id", id);
      backdropEl.setAttribute("modal-backdrop", "");
      backdropEl.classList.add(...this._options.backdropClasses.split(" "));
      this._parentEl.append(backdropEl);
      backdropEl.offsetWidth;
      backdropEl.classList.add("cfm-opacity-50");
    }
  }
  _destroyBackdropEl() {
    if (!this._isHidden) {
      let id = this._targetEl.getAttribute("data-ref-id");
      document.querySelector(`[modal-backdrop][data-ref-id="${id}"]`).remove();
    }
  }
  _getPlacementClasses() {
    switch (this._options.placement) {
      // top
      case "top-left":
        return ["justify-content-start", "align-items-start"];
      case "top-center":
        return ["justify-content-center", "align-items-start"];
      case "top-right":
        return ["justify-content-end", "align-items-start"];

      // center
      case "center-left":
        return ["justify-content-start", "align-items-center"];
      case "center":
        return ["justify-content-center", "align-items-center"];
      case "center-right":
        return ["justify-content-end", "align-items-center"];

      // bottom
      case "bottom-left":
        return ["justify-content-start", "align-items-end"];
      case "bottom-center":
        return ["justify-content-center", "align-items-end"];
      case "bottom-right":
        return ["justify-content-end", "align-items-end"];

      default:
        return ["justify-content-center", "align-items-center"];
    }
  }
  _getSizeClasses() {
    return templatePacks[this._options.templatePack].sizes[
      this._options.size
    ].split(" ");
  }
  _clearSize() {
    const element = this._targetEl.firstElementChild;
    const obj = templatePacks[this._options.templatePack].sizes;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        element.classList.remove(obj[key]);
      }
    }
  }
  _addEventListeners() {
    let that = this;
    this._targetEl.addEventListener("keyup", function (e) {
      if (e.key === "Escape") {
        that.hide();
      }
    });
  }
  toggle() {
    if (this._isHidden) {
      this.show();
    } else {
      this.hide();
    }

    // callback function
    this._options.onToggle(this);
  }
  show() {
    const id = uuidv4();
    this._targetEl.classList.add("d-flex");
    this._targetEl.classList.remove("d-none");
    this._targetEl.setAttribute("aria-modal", "true");
    this._targetEl.setAttribute("role", "dialog");
    this._targetEl.removeAttribute("aria-hidden");
    this._targetEl.setAttribute("data-ref-id", id);
    this._createBackdrop(id);
    this._isHidden = false;

    document.body.classList.add("modal-open");

    // callback function
    this._options.onShow(this);

    let firstEl = this._targetEl.querySelector(
      'select, input:not([type="hidden"]'
    );
    if (firstEl) {
      firstEl.setAttribute("tabindex", "0");
      firstEl.focus();
    }
    this._targetEl.offsetWidth;
    this._targetEl.classList.add("cfm-opacity-100");
  }
  hide() {
    this._targetEl.classList.add("d-none");
    this._targetEl.classList.remove("d-flex");
    this._targetEl.setAttribute("aria-hidden", "true");
    this._targetEl.removeAttribute("aria-modal");
    this._targetEl.removeAttribute("role");
    this._destroyBackdropEl();
    this._isHidden = true;

    document.body.classList.remove("modal-open");

    // callback function
    this._options.onHide(this);
  }
}

export default Modal;
