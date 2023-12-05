import $ from "jquery";
import ModalForm from "./modal-form";
import {
  executeAllCalculatedFields,
  getNumberValue,
  getTextValue,
  hookCalculatedFields,
  removeChildren,
  templatePacks,
  uuidv4,
} from "./utils";

const variant = {
  tabular: "tabular",
  stacked: "stacked",
  modal: "modal",
};


class FormsetModal {
  constructor(elementId) {
    this._id = elementId;
    this.targetEl = document.getElementById(this._id);
    this.variant = variant.tabular;
    this.$formset = null;
    this._modalForms = [];
    this._deleteBt = null;
    this._table = null;
    this._tbody = null;
    this._tfoot = null;
    this._init();
    this._addEvents();
  }
  _init() {
    this.variant = this._getVariant();
    this.templatePack = this._getTemplatePack();
    this.modalSize = this._getModalSize();
    this.modalPlacement = this._getModalPlacement();
    // Create Formset Helper Instance
    this.$formset = $(`#${this._id}`);
    this.$formset.formset({
      animateForms: true,
    });
    if (this.variant === variant.modal || this.variant == variant.tabular) {
      this._table = this.targetEl.querySelector("table");
      this._tbody = this._table.querySelector("tbody");
      this._tfoot = this._table.querySelector("tfoot");
      this._emptyState = this._tbody.innerHTML;
    }
    if (this.variant === variant.modal) {
      this._deleteBt = this.targetEl.querySelector(".delete-selected");
      this._checkInitials();
      this._configureSelectAllToggler();
      this._refresh();
    }
  }
  _getVariant() {
    return this.targetEl.getAttribute("data-formset-variant");
  }
  _getTemplatePack() {
    return this.targetEl.getAttribute("data-template-pack");
  }
  _getClasses(name) {
    return templatePacks[this.templatePack].classes[name].split(" ");
  }
  _getEditButton(modalId) {
    const templateEl = this.targetEl.querySelector("template");
    const template = templateEl.content.cloneNode(true);
    const editButton = template.querySelector("button");

    if (!editButton.classList.contains("btn-open-row")) {
      editButton.classList.add("btn-open-row");
    }

    editButton.setAttribute("data-formset-modal-toggle", modalId);
    return editButton;
  }
  _getModalSize() {
    return this.targetEl.getAttribute("data-modal-size");
  }
  _getModalPlacement() {
    return this.targetEl.getAttribute("data-modal-placement");
  }
  _getModalFormInstanceByRownum(rownum) {
    let instance = false;
    this._modalForms.forEach(function (obj) {
      if (obj.rownum === rownum && !obj.isDeleted()) {
        instance = obj;
      }
    });
    return instance;
  }
  _addEvents() {
    let that = this;
    this.$formset.on("formAdded", function (e) {
      that._onFormsetAdded(e);
    });
    this.$formset.on("formDeleted", function (e) {
      that._onFormsetDeleted(e);
    });
  }
  /**
   * Check if the page loaded form from the server to configure them.
   */
  _checkInitials() {
    let that = this;
    let modals = [];
    this.targetEl
      .querySelectorAll("[data-formset-modal-toggle]")
      .forEach(function (el) {
        let targetEl = el.closest("[data-formset-form]");
        let modalId = el.getAttribute("data-formset-modal-toggle");
        if (!modals.includes(modalId)) {
          that._newModalForm(targetEl, modalId);
        }
        modals.push(modalId);
      });
  }
  _newModalForm(targetEl, modalId) {
    let that = this;
    let options = {
      parent: that,
      modalId: modalId,
      size: that.modalSize,
      placement: that.modalPlacement,
      templatePack: that.templatePack,
      onKeyUp: function (e, modalForm) {
        that._onModalFormKeyUp(e, modalForm);
      },
      onOpen: function (modalForm) {
        that._onModalFormOpen(modalForm);
      },
      onClose: function (modalForm) {
        that._onModalFormClose(modalForm);
      },
    };
    let modalForm = new ModalForm(targetEl, options);
    that._modalForms.push(modalForm);
    return modalForm;
  }
  _onFormsetAdded(e) {
    if (this.variant === variant.modal) {
      let id = uuidv4();
      $(this.targetEl).find("#__dialog_id__").attr("id", id);
      $(this.targetEl)
        .find('[data-formset-modal-toggle="__dialog_id__"]')
        .attr("data-formset-modal-toggle", id);
      let modalForm = this._newModalForm(e.target, id);
      modalForm.open();
    }
    if (window.hasOwnProperty("calculatedFields")) {
      window.resetCalculatedFields();
      hookCalculatedFields();
    }
  }
  _onFormsetDeleted() {
    if (this.variant == variant.modal) {
      this._refresh();
    }
    executeAllCalculatedFields();
  }
  _onModalFormKeyUp(e, modalForm) {
    if (e.ctrlKey && (e.keyCode === 38 || e.keyCode === 40)) {
      e.preventDefault();
      let openRownum = modalForm.rownum;
      let $formset = this.$formset.formset("getOrCreate");
      let activeFormCount = $formset.activeFormCount();
      if (e.keyCode == 38) {
        // Up
        if (openRownum > 1) {
          modalForm.close();
          let previewsModalForm = this._getModalFormInstanceByRownum(
            openRownum - 1
          );
          previewsModalForm.open();
        }
      }

      if (e.keyCode === 40) {
        // Down
        if (openRownum < activeFormCount) {
          modalForm.close();
          let nextsModalForm = this._getModalFormInstanceByRownum(
            openRownum + 1
          );
          nextsModalForm.open();
        }
        if (openRownum == activeFormCount) {
          modalForm.close();
          $formset.addForm();
        }
      }
    }
  }
  _onModalFormOpen(modalForm) {
    this._refresh();
  }
  _onModalFormClose(modalForm) {
    this._refresh();
  }
  _configureSelectAllToggler() {
    let that = this;
    let table = this._table;
    let toggler = this.targetEl.querySelector(".select-all");
    let deleteBt = this.targetEl.querySelector(".delete-selected");

    toggler.addEventListener("change", function (e) {
      let checked = toggler.checked;
      let checkBoxes = table.querySelectorAll(".select-row");
      checkBoxes.forEach(function (checkbox) {
        let tr = checkbox.closest("tr");
        let td = checkbox.closest("td");
        let btnOpenRow = tr.querySelector("[data-formset-modal-toggle]");
        let modalId = btnOpenRow.getAttribute("data-formset-modal-toggle");
        let modalEl = document.getElementById(modalId);
        let formsetFormEl = modalEl.closest("[data-formset-form]");
        checkbox.checked = checked;
        that._checker(tr, td, formsetFormEl, checkbox);
      });
    });

    deleteBt.addEventListener("click", function (e) {
      let formset = that.targetEl;
      let selectedForms = formset.querySelectorAll(
        "[data-formset-form-selected]"
      );
      selectedForms.forEach(function (selectedForm) {
        let deleteCheckbox = selectedForm.querySelector(".formset-delete");
        deleteCheckbox.checked = true;
        deleteCheckbox.dispatchEvent(new Event("change"));
      });
    });
  }
  _checkSelectAllState() {
    let table = this._table;
    let formset = this.targetEl;
    let deleteBt = formset.querySelector(".delete-selected");
    let showDeleteBt = false;
    let selectAllToggler = table.querySelector(".select-all");
    let recordCount = table.querySelectorAll("tbody tr").length;
    let selected = table.querySelectorAll("tr.selected").length;

    if (selected === recordCount && recordCount > 0) {
      selectAllToggler.checked = true;
      selectAllToggler.indeterminate = false;
      showDeleteBt = true;
    } else {
      if (selected != recordCount && selected > 0) {
        selectAllToggler.indeterminate = true;
        selectAllToggler.checked = false;
        showDeleteBt = true;
      }
      if (selected === 0) {
        selectAllToggler.checked = false;
        selectAllToggler.indeterminate = false;
        showDeleteBt = false;
      }
    }

    if (showDeleteBt) {
      deleteBt.classList.remove(...this._getClasses("hidden"));
      deleteBt.classList.add(...this._getClasses("inlineFlex"));
    } else {
      deleteBt.classList.remove(...this._getClasses("inlineFlex"));
      deleteBt.classList.add(...this._getClasses("hidden"));
    }
  }
  _checker(tr, td, formsetFormEl, checkbox) {
    // remove previous divSel if exists.
    let prevDivSel = td.querySelector(".cfm-selection-border, .selection-border");
    if (prevDivSel) {
      prevDivSel.remove();
    }
    if (checkbox.checked) {
      let divSel = document.createElement("div");
      td.classList.add(...this._getClasses("relative"));
      divSel.classList.add(...this._getClasses("selectionMark"));
      td.prepend(divSel);
      formsetFormEl.setAttribute("data-formset-form-selected", "selected");
      tr.classList.add("selected");
    } else {
      checkbox.classList.remove(...this._getClasses("relative"));
      tr.classList.remove("selected");
      formsetFormEl.removeAttribute("data-formset-form-selected");
    }
    this._checkSelectAllState();
  }
  _refresh() {
    let that = this;
    let fields = {};
    let fieldNames = [];
    let rows = [];

    this._table.querySelectorAll("[data-field-name]").forEach(function (el) {
      fields[el.getAttribute("data-field-name")] = {
        type: el.getAttribute("data-field-type"),
        hasSummary: el.hasAttribute("data-field-summary"),
        summary: 0,
      };
    });

    fieldNames = Object.keys(fields);

    this._modalForms.forEach(function (modalForm) {
      if (!modalForm.isDeleted()) {
        let row = {};
        modalForm.targetEl
          .querySelectorAll("input, select, textarea")
          .forEach(function (el) {
            let match = el.name.match(
              /(?<form>\w+)-(?<number>\w+)-(?<name>\w+)/
            );
            if (match) {
              let name = match.groups.name;
              if (fieldNames.includes(name)) {
                let content = getTextValue(el);
                row[name] = {
                  value: content,
                  sourceId: el.getAttribute("id"),
                };
                row["modalForm"] = modalForm;
              }
            }
          });
        rows.push(row);
      }
    });

    // Remove all rows
    removeChildren(this._tbody);

    if (rows.length === 0) {
      this._tbody.innerHTML = this._emptyState;
    }

    let rownum = 1;
    rows.forEach(function (row) {
      row.modalForm.rownum = rownum;
      // Table row
      let tr = document.createElement("tr");
      tr.classList.add(...that._getClasses("tr"));
      tr.setAttribute("data-rownum", rownum);
      // Highlight row if there are non field errors
      if (row.modalForm.hasNonFieldError()) {
        tr["style"] = "border: 1px solid #ff4545";
      }
      // Selection column
      let tdSel = document.createElement("td");
      let selCheckbox = document.createElement("input");
      selCheckbox.setAttribute("type", "checkbox");
      selCheckbox.classList.add(...that._getClasses("checkbox"));
      selCheckbox.classList.add("select-row");
      tdSel.appendChild(selCheckbox);
      tdSel.classList.add(...that._getClasses("td"))
      selCheckbox.addEventListener("change", function (e) {
        that._checker(tr, tdSel, row.modalForm.targetEl, e.target);
      });
      tr.appendChild(tdSel);
      // Column for row number
      let tdNumber = document.createElement("td");
      tdNumber.classList.add(...that._getClasses("td"));
      tdNumber.classList.add(...that._getClasses("textRight"));
      tdNumber.classList.add(...that._getClasses("pointer"));
      tdNumber.innerText = rownum;
      tdNumber.addEventListener("click", function () {
        row.modalForm.open();
      });
      tr.appendChild(tdNumber);
      // Mirror columns
      fieldNames.forEach(function (field) {
        let td = document.createElement("td");
        let hasError = row.modalForm.hasFieldError(row[field].sourceId);
        td.classList.add(...that._getClasses("td"));
        if (hasError.error) {
          td["style"] = "border: 1px solid #ff4545";
          td["title"] = hasError.text;
        }
        if (fields[field].type === "bool") {
          let checked = row[field].value === "on" ? "checked" : "";
          td.innerHTML = `<input type="checkbox" class="${that
            ._getClasses("checkbox")
            .join(" ")}" ${checked} disabled></input>`;
        } else {
          td.innerText = row[field].value;
        }
        if (fields[field].type === "numeric") {
          td.classList.add(...that._getClasses("textRight"));
          if (fields[field].hasSummary) {
            fields[field].summary =
              fields[field].summary + getNumberValue(row[field].value);
          }
        }
        if (fields[field].type === "bool" || fields[field].type == "date") {
          td.classList.add(...that._getClasses("textCenter"));
        }
        td.setAttribute("data-source", row[field].sourceId);
        tr.appendChild(td);
      });
      // Column for edit button
      let tdEdit = document.createElement("td");
      tdEdit.classList.add(...that._getClasses("td"));
      tdEdit.classList.add(...that._getClasses("textCenter"));
      tdEdit.classList.add(...that._getClasses("p0"));
      tdEdit.classList.add(...that._getClasses("alignMiddle"));
      tdEdit.appendChild(that._getEditButton(row.modalForm.modalId));
      let button = tdEdit.querySelector(".btn-open-row");

      button.addEventListener("click", function (e) {
        row.modalForm.open();
      });

      tr.appendChild(tdEdit);
      that._tbody.appendChild(tr);

      if (row.modalForm.isSelected()) {
        selCheckbox.checked = true;
        that._checker(tr, tdSel, row.modalForm.targetEl, selCheckbox);
      }

      rownum++;
    });

    if (this._tfoot) {
      this._tfoot
        .querySelectorAll("[data-summary-column]")
        .forEach(function (el) {
          let summary = fields[el.getAttribute("data-summary-column")].summary;
          el.innerText = summary;
        });
    }

    this._checkSelectAllState();
  }
}

export default FormsetModal;
