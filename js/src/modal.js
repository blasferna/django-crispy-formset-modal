import { uuidv4, templatePacks } from "./utils";

const modalDefault = {
  placement: "center",
  size: "md",
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
      backdropEl.classList.add(...this._getClasses("backdrop"));
      this._parentEl.append(backdropEl);
      backdropEl.offsetWidth;
      backdropEl.classList.add(...this._getClasses("opacity50"));
    }
  }
  _destroyBackdropEl() {
    if (!this._isHidden) {
      let id = this._targetEl.getAttribute("data-ref-id");
      document.querySelector(`[modal-backdrop][data-ref-id="${id}"]`).remove();
    }
  }
  _getPlacementClasses() {
    let that = this;
    switch (this._options.placement) {
      // top
      case "top-left":
        return [
          that._getClasses("justifyStart", false),
          that._getClasses("itemsStart", false),
        ];
      case "top-center":
        return [
          that._getClasses("justifyCenter", false),
          that._getClasses("itemsStart", false),
        ];
      case "top-right":
        return [
          that._getClasses("justifyEnd", false),
          that._getClasses("itemsStart", false),
        ];

      // center
      case "center-left":
        return [
          that._getClasses("justifyStart", false),
          that._getClasses("itemsCenter", false),
        ];
      case "center":
        return [
          that._getClasses("justifyCenter", false),
          that._getClasses("itemsCenter", false),
        ];
      case "center-right":
        return [
          that._getClasses("justifyEnd", false),
          that._getClasses("itemsCenter", false),
        ];

      // bottom
      case "bottom-left":
        return [
          that._getClasses("justifyStart", false),
          that._getClasses("itemsEnd", false),
        ];
      case "bottom-center":
        return [
          that._getClasses("justifyCenter", false),
          that._getClasses("itemsEnd", false),
        ];
      case "bottom-right":
        return [
          that._getClasses("justifyEnd", false),
          that._getClasses("itemsEnd", false),
        ];

      default:
        return [
          that._getClasses("justifyCenter", false),
          that._getClasses("itemsCenter", false),
        ];
    }
  }
  _getSizeClasses() {
    return templatePacks[this._options.templatePack].sizes[
      this._options.size
    ].split(" ");
  }
  _getClasses(name, str = false) {
    let names = templatePacks[this._options.templatePack].classes[name];
    return str ? names : names.split(" ");
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
    this._targetEl.classList.add(...this._getClasses("flex"));
    this._targetEl.classList.remove(...this._getClasses("hidden"));
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
    this._targetEl.classList.add(...this._getClasses("opacity100"));
  }
  hide() {
    this._targetEl.classList.add(...this._getClasses("hidden"));
    this._targetEl.classList.remove(...this._getClasses("flex"));
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
