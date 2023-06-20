import $ from "jquery";
import ModalForm from "./modal-form";
import {
  executeAllCalculatedFields,
  getNumberValue,
  getTextValue,
  gettext,
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

const formsetOptions = {
  editText: gettext("Edit"),
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
    this.editOnTable = this._getEditOnModal();
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
  _getPencilIcon() {
    return templatePacks[this.templatePack].pencilIcon;
  }
  _getModalSize() {
    return this.targetEl.getAttribute("data-modal-size");
  }
  _getModalPlacement() {
    return this.targetEl.getAttribute("data-modal-placement");
  }
  _getEditOnModal() {
    return this.targetEl.hasAttribute("data-edit-on-table");
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
      if (!this.editOnTable) {
        modalForm.open();
      } else {
        this._refresh();
        // set focus to the first editable element
        let rows = Array.from(
          this.targetEl.closest(".formset").querySelectorAll("tr")
        );
        let filteredRows = rows.filter(
          (row) => row.querySelector("td[data-source]") !== null
        );
        let firstColumn =
          filteredRows[filteredRows.length - 1].querySelector(
            "td[data-source]"
          );
        firstColumn.firstChild.focus();
      }
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
    let prevDivSel = td.querySelector(
      ".cfm-selection-border, .selection-border"
    );
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
      tdSel.classList.add(...that._getClasses("td"));
      tdSel.classList.add(...that._getClasses("alignMiddle"));
      selCheckbox.addEventListener("change", function (e) {
        that._checker(tr, tdSel, row.modalForm.targetEl, e.target);
      });
      tr.appendChild(tdSel);
      // Column for row number
      let tdNumber = document.createElement("td");
      tdNumber.classList.add(...that._getClasses("td"));
      tdNumber.classList.add(...that._getClasses("textRight"));
      tdNumber.classList.add(...that._getClasses("pointer"));
      tdNumber.classList.add(...that._getClasses("alignMiddle"));
      tdNumber.innerText = rownum;
      tdNumber.addEventListener("click", function () {
        row.modalForm.open();
      });
      tr.appendChild(tdNumber);
      // Mirror columns
      fieldNames.forEach(function (field) {
        let td = document.createElement("td");
        td.classList.add(...that._getClasses("td"));

        if (that.editOnTable) {
          let $inputOriginal = $(`#${row[field].sourceId}`);
          let $inputTable = that._clone($inputOriginal);

          let eventType = "input";
          if ($inputOriginal.is("select")) {
            eventType = "change";
          }

          $inputTable.on(eventType, function () {
            if (
              $inputOriginal.is('input[type="checkbox"], input[type="radio"]')
            ) {
              $inputOriginal.prop("checked", $inputTable.prop("checked"));
            } else {
              if ($inputOriginal.attr("data-autocomplete-light-function")) {
                $inputOriginal.select2("trigger", "select", {
                  data: {
                    id: $inputTable.val(),
                    text: $inputTable.select2("data")[0].text,
                  },
                });
              } else {
                $inputOriginal.val($inputTable.val());
              }
            }
            let event = new Event(eventType, {
              bubbles: true,
            });
            $inputOriginal[0].dispatchEvent(event);
            that._refreshTableFieldValues($inputTable);
          });

          $inputTable.appendTo($(td));
        } else {
          let hasError = row.modalForm.hasFieldError(row[field].sourceId);
          if (hasError.error) {
            td["style"] = "border: 1px solid #ff4545";
            td["title"] = hasError.text;
          }
          if (fields[field].type === "bool") {
            checked = row[field].value === "on" ? "checked" : "";
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
      tdEdit.innerHTML = `
                <button type="button"
                        title="${that._options.editText}" 
                        class="${that._getClasses("editBtn").join(" ")}"
                        data-formset-modal-toggle="${row.modalForm.modalId}">
                        ${that._getPencilIcon()}
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
  _refreshTableFieldValues($sourceInputTable) {
    let $tr = $sourceInputTable.closest("tr");
    let $cols = $tr.find("td[data-source]");
    $cols.each(function (el) {
      let $col = $(this);
      let inputOriginalSelector = `#${$col.attr("data-source")}`;
      let inputTableSelector = `${inputOriginalSelector}-table`;
      let $inputOriginal = $(inputOriginalSelector);
      let $inputTable = $(inputTableSelector);
      if ($sourceInputTable[0] !== $inputTable[0]) {
        if ($inputOriginal.is('input[type="checkbox"], input[type="radio"]')) {
          $inputTable.prop("checked", $inputOriginal.prop("checked"));
        } else {
          $inputTable.val($inputOriginal.val());
        }
      }
    });
  }
  _cloneFormTemplateField($inputOriginal) {
    let id = $inputOriginal.attr("id");
    let idNumber = id.match(/-\d+-/)[0].replace(/-/g, "");
    let emptyForm = $("script[data-formset-empty-form]").html();
    let templateId = id.replace(/-\d+-/, "-__prefix__-");
    let $emptyForm = $(emptyForm);
    let $templateInput = $emptyForm.find("#" + templateId);

    if ($templateInput.length) {
      let newInput = $templateInput.clone();
      newInput.attr(
        "id",
        newInput.attr("id").replace(new RegExp("__prefix__", "g"), idNumber) +
          "-table"
      );
      newInput.removeAttr("name");
      return newInput[0].outerHTML;
    }

    return null;
  }
  _clone($inputOriginal) {
    if ($inputOriginal.attr("data-autocomplete-light-function")) {
      let $newInput = $(this._cloneFormTemplateField($inputOriginal));
      if ($inputOriginal.attr("data-autocomplete-light-function")) {
        $(document).on("dal-element-initialized", function (e) {
          if (e.detail.element.id === $($newInput).attr("id")) {
            $newInput.select2("trigger", "select", {
              data: {
                id: $inputOriginal.val(),
                text: $inputOriginal.select2("data")[0].text,
              },
            });
          }
        });
      }
      return $newInput;
    } else {
      return $inputOriginal.clone();
    }
  }
}

export default FormsetModal;
