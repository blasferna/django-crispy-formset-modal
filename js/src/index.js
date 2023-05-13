import $ from "jquery";
import Formset, { pluginName } from "./formset";
import FormsetModal from "./formset-modal";
import Modal from "./modal";
import {
  executeAllCalculatedFields,
  getModalInstance,
  hookCalculatedFields,
  ready,
  injectStyles,
} from "./utils";

function configureFormsets() {
  let formsets = document.querySelectorAll(".formset");
  formsets.forEach(function (formsetEl) {
    new FormsetModal(formsetEl.getAttribute("id"));
  });
}

function configureModals() {
  let modalInstances = [];
  document.querySelectorAll("[data-modal-toggle]").forEach((el) => {
    const modalId = el.getAttribute("data-modal-toggle");
    const modalEl = document.getElementById(modalId);
    const placement = modalEl.getAttribute("data-modal-placement");

    if (modalEl) {
      if (
        !modalEl.hasAttribute("aria-hidden") &&
        !modalEl.hasAttribute("aria-modal")
      ) {
        modalEl.setAttribute("aria-hidden", "true");
      }
    }

    let modal = null;
    if (getModalInstance(modalId, modalInstances)) {
      modal = getModalInstance(modalId, modalInstances);
      modal = modal.object;
    } else {
      modal = new Modal(modalEl, {
        placement: placement ? placement : Default.placement,
      });
      modalInstances.push({
        id: modalId,
        object: modal,
      });
    }

    if (
      modalEl.hasAttribute("data-modal-show") &&
      modalEl.getAttribute("data-modal-show") === "true"
    ) {
      modal.show();
    }

    el.addEventListener("click", () => {
      modal.toggle();
    });
  });
}

$.fn[pluginName] = function () {
  var options, fn, args;
  // Create a new Formset for each element
  if (
    arguments.length === 0 ||
    (arguments.length === 1 && $.type(arguments[0]) != "string")
  ) {
    options = arguments[0];
    return this.each(function () {
      return Formset.getOrCreate(this, options);
    });
  }

  // Call a function on each Formset in the selector
  fn = arguments[0];
  args = $.makeArray(arguments).slice(1);

  if (fn in Formset) {
    // Call the Formset class method if it exists
    args.unshift(this);
    return Formset[fn].apply(Formset, args);
  } else {
    throw new Error("Unknown function call " + fn + " for $.fn.formset");
  }
};

ready(function () {
  injectStyles();
  configureModals();
  hookCalculatedFields();
  configureFormsets();
  executeAllCalculatedFields();
});
