import Modal from "./modal";
import { gettext } from "./utils";

const modalFormOptions = {
  parent: null,
  modalId: null,
  onKeyUp: function () {},
  onClose: function () {},
  onOpen: function () {},
};

class ModalForm {
  constructor(targetEl, options = {}) {
    this.targetEl = targetEl;
    this._options = {
      ...modalFormOptions,
      ...options,
    };
    this.modalId = this._options.modalId;
    this._modalEl = null;
    this._modalTitleEl = null;
    this._modalDeleteBt = null;
    this.modalInstance = false;
    this.rownum = null;
    this._init();
    this._addEvents();
  }
  _init() {
    this._modalEl = document.getElementById(this.modalId);
    this._modalTitleEl = this._modalEl.querySelector(".modal-title");
    this._modalDeleteBt = this._modalEl.querySelector(".formset-delete");
    this._createModal();
  }
  _addEvents() {
    let that = this;
    this._modalEl
      .querySelectorAll('[data-formset-modal-toggle="' + this.modalId + '"]')
      .forEach(function (el) {
        el.addEventListener("click", function () {
          that.close();
        });
      });
  }
  hasFieldError(fieldId) {
    let fieldWrapper = this.targetEl.querySelector(`#div_${fieldId}`);
    let hasError = false;
    let errorText = "";
    fieldWrapper
      .querySelectorAll("[id^='error_']")
      .forEach(function (el) {
        hasError = true;
        errorText = el.innerText;
      });
    return { error: hasError, text: errorText };
  }
  hasNonFieldError() {
    return this.targetEl.querySelector(".non-field-errors") != null;
  }
  errors() {
    let errors = {};
    this.targetEl.querySelectorAll("[id^='error_']").forEach(function (el) {
      let fieldId = el.id.replace("error_", "");
      let fieldName = fieldId.replace(/.*?-.*?-(.*)/, "$1");
      errors[fieldName] = {
        error: el.innerText,
        sourceId: fieldId,
      };
    });
    return errors;
  }
  hasErrorsNotIncluded(errors, row) {
    let errorProps = Object.keys(errors);
    let propsNotIncluded = errorProps.filter(
      (prop) => !row.hasOwnProperty(prop)
    );
    let allHasErrorFalse = Object.values(row).every(
      (field) => !field.hasError || !field.hasError.error
    );
    return propsNotIncluded.length > 0 && allHasErrorFalse;
  }
  _hiddeDefaultDeleteBt(el) {
    let parentEl = el.parentNode;
    parentEl.classList.add("d-none");
  }
  _createModal() {
    let that = this;
    if (!this.modalInstance) {
      let deleteBt = this.targetEl.querySelector(".formset-delete");
      let modal = new Modal(this._modalEl, {
        placement: that._options.placement,
        size: that._options.size,
        templatePack: that._options.templatePack,
        onHide: function (modal) {
          that._onModalClose(modal);
        },
        onShow: function (modal) {
          that._onModalShow(modal);
        },
      });
      modal._targetEl.addEventListener("keyup", function (e) {
        that._options.onKeyUp(e, that);
      });
      this.modalInstance = modal;
      this._hiddeDefaultDeleteBt(deleteBt);
    }
  }
  _onModalShow(modal) {
    this._options.onOpen(this);
    let openRowBt = this._options.parent.targetEl.querySelector(
      ".btn-open-row[data-formset-modal-toggle='" + this.modalId + "']"
    );
    let tr = openRowBt.closest("tr");
    this._modalTitleEl.innerText = gettext("Editing row #") + this.rownum;
    tr.classList.add("row-open");
  }
  _onModalClose(modal) {
    this._options.onClose(this);
    let openRowBt = this._options.parent.targetEl.querySelector(
      ".btn-open-row[data-formset-modal-toggle='" + this.modalId + "']"
    );
    if (openRowBt) {
      let tr = openRowBt.closest("tr");
      tr.classList.remove("row-open");
    }
  }
  isDeleted() {
    return this.targetEl.hasAttribute("data-formset-form-deleted");
  }
  isSelected() {
    return this.targetEl.hasAttribute("data-formset-form-selected");
  }
  open() {
    this.modalInstance.show();
  }
  close() {
    this.modalInstance.hide();
  }
}

export default ModalForm;
