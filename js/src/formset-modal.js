import $ from "jquery";
import ModalForm from "./modal-form";
import {
  executeAllCalculatedFields,
  getNumberValue,
  getTextValue,
  hookCalculatedFields,
  uuidv4,
  removeChildren,
} from "./utils";

const variant = {
  tabular: "tabular",
  stacked: "stacked",
  modal: "modal",
};

const pencilSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
</svg>
`;

const formsetOptions = {
  checkboxClasses: "checkbox",
  selectionMarkClasses: "cfm-selection-border",
  tdClasses: "cfm-td",
  trClasses: "cfm-tr",
  editText: "Editar",
  pencilIcon: pencilSvg,
};

class FormsetModal {
  constructor(elementId) {
    this._id = elementId;
    this.targetEl = document.getElementById(this._id);
    this.variant = variant.tabular;
    this.$formset = null;
    this._options = {
      ...formsetOptions,
    };
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
  _getTemplatePack(){
    return this.targetEl.getAttribute("data-template-pack");
  }
  _getModalSize(){
    return this.targetEl.getAttribute("data-modal-size");
  }
  _getModalPlacement(){
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
      size: this.modalSize,
      placement: this.modalPlacement,
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
      deleteBt.classList.remove("d-none");
      deleteBt.classList.add("d-inline-flex");
    } else {
      deleteBt.classList.remove("d-inline-flex");
      deleteBt.classList.add("d-none");
    }
  }
  _checker(tr, td, formsetFormEl, checkbox) {
    // remove previous divSel if exists.
    let prevDivSel = td.querySelector(".cfm-selection-border");
    if (prevDivSel) {
      prevDivSel.remove();
    }
    if (checkbox.checked) {
      let divSel = document.createElement("div");
      td.classList.add("position-relative");
      divSel.classList.add(...this._options.selectionMarkClasses.split(" "));
      td.prepend(divSel);
      formsetFormEl.setAttribute("data-formset-form-selected", "selected");
      tr.classList.add("selected");
    } else {
      checkbox.classList.remove("position-relative");
      tr.classList.remove("selected");
      formsetFormEl.removeAttribute("data-formset-form-selected");
    }
    this._checkSelectAllState();
  }
  _getEmptyStateHtml(count) {
    let template = `
        <tr class="empty-table">
            <td class="empty-table-content text-center" colspan=__colspan__>
                Sin datos     
            </td>
        </tr>
        `;
    template = template.replace("__colspan__", count);
    return template;
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
          .querySelectorAll("input, select")
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
      this._tbody.innerHTML = this._getEmptyStateHtml(fieldNames.length + 3);
    }

    let rownum = 1;
    rows.forEach(function (row) {
      row.modalForm.rownum = rownum;
      // Table row
      let tr = document.createElement("tr");
      tr.classList.add(...that._options.trClasses.split(" "));
      tr.setAttribute("data-rownum", rownum);
      // Highlight row if there are non field errors
      if (row.modalForm.hasNonFieldError()) {
        tr["style"] = "border: 1px solid #ff4545";
      }
      // Selection column
      let tdSel = document.createElement("td");
      let selCheckbox = document.createElement("input");
      selCheckbox.setAttribute("type", "checkbox");
      selCheckbox.classList.add(...that._options.checkboxClasses.split(" "));
      selCheckbox.classList.add("select-row");
      tdSel.appendChild(selCheckbox);
      //tdSel.classList.add('w-10');
      //tdSel.classList.add('text-center', 'dark:bg-gray-700', 'dark:border-gray-600');
      selCheckbox.addEventListener("change", function (e) {
        that._checker(tr, tdSel, row.modalForm.targetEl, e.target);
      });
      tr.appendChild(tdSel);
      // Column for row number
      let tdNumber = document.createElement("td");
      tdNumber.classList.add(...that._options.tdClasses.split(" "));
      tdNumber.classList.add("w-10");
      tdNumber.classList.add("text-right");
      tdNumber.classList.add("cursor-pointer");
      tdNumber.innerText = rownum;
      tdNumber.addEventListener("click", function () {
        row.modalForm.open();
      });
      tr.appendChild(tdNumber);
      // Mirror columns
      fieldNames.forEach(function (field) {
        let td = document.createElement("td");
        let hasError = row.modalForm.hasFieldError(row[field].sourceId);
        td.classList.add(...that._options.tdClasses.split(" "));
        if (hasError.error) {
          td["style"] = "border: 1px solid #ff4545";
          td["title"] = hasError.text;
        }
        if (fields[field].type === "bool") {
          checked = row[field].value === "on" ? "checked" : "";
          td.innerHTML = `<input type="checkbox" class="${that._options.checkboxClasses}" ${checked} disabled></input>`;
        } else {
          td.innerText = row[field].value;
        }
        if (fields[field].type === "numeric") {
          td.classList.add("text-right");
          if (fields[field].hasSummary) {
            fields[field].summary =
              fields[field].summary + getNumberValue(row[field].value);
          }
        }
        if (fields[field].type === "bool" || fields[field].type == "date") {
          td.classList.add("text-center");
        }
        td.setAttribute("data-source", row[field].sourceId);
        tr.appendChild(td);
      });
      // Column for edit button
      let tdEdit = document.createElement("td");
      tdEdit.classList.add(...that._options.tdClasses.split(" "));
      tdEdit.classList.add("w-16");
      tdEdit.classList.add("text-center");
      tdEdit.classList.add("p-0")
      tdEdit.classList.add("align-middle")
      tdEdit.innerHTML = `
                <button title="${that._options.editText}" 
                        class="btn-open-row btn btn-sm btn btn-primary"
                        data-formset-modal-toggle="${row.modalForm.modalId}">
                        ${that._options.pencilIcon}
                </button>`;
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
