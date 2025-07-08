# Customizing Django Crispy Formset Modal

Django Crispy Formset Modal offers several customization options to suit your specific requirements. This section covers some of these options.

## Using Different Template Packs

Django Crispy Formset Modal comes with support for Bootstrap 4, Bootstrap 5, Tailwind, and Bulma. Select the template pack by setting the `CRISPY_TEMPLATE_PACK` option in your Django `settings`:

```python
# settings.py
CRISPY_TEMPLATE_PACK = 'bootstrap4'  # or 'bootstrap5', 'tailwind', 'bulma'
```

Ensure that you include the respective CSS and JS files in your template for the selected pack.

## Customizing Modal Size and Placement

Django Crispy Formset Modal allows you to customize the size and placement of your modal by setting `modal_size` and `modal_placement` attributes in the `ModalEditFormsetLayout` object. You can set these attributes using the `ModalSize` and `ModalPlacement` classes respectively.

The `ModalSize` class includes the following options:

```python
from crispy_formset_modal import ModalSize

ModalSize.SM  # Small
ModalSize.MD  # Medium
ModalSize.LG  # Large
ModalSize.XL  # Extra Large
```

The `ModalPlacement` class includes the following options:

```python
from crispy_formset_modal import ModalPlacement

ModalPlacement.TOP_LEFT
ModalPlacement.TOP_CENTER
ModalPlacement.TOP_RIGHT
ModalPlacement.CENTER_LEFT
ModalPlacement.CENTER
ModalPlacement.CENTER_RIGHT
ModalPlacement.BOTTOM_LEFT
ModalPlacement.BOTTOM_CENTER
ModalPlacement.BOTTOM_RIGHT
```

For instance, to set a large modal size and center placement, you would modify your formset layout like so:

```python
self.helper.layout = Layout(
    Fieldset(
        "Items",
        ModalEditFormsetLayout(
            "InvoiceItemInline",
            list_display=["description", "quantity", "unit_price"],
            modal_size=ModalSize.LG,  # set the modal size to large
            modal_placement=ModalPlacement.CENTER  # set the modal placement to center
        ),
    ),
    ...
)
```

## Overriding Default Templates

Django Crispy Formset Modal uses several templates to render formsets and modals. These templates can be overridden to customize the look and feel of your formsets. The templates you can override are:

* `form.html`: This template is used to render the form within the modal.
* `modal.html`: This template is used to render the modal dialog for adding/editing formset instances.
* `table.html`: This template is used to render the HTML table that displays the formset data.
* `edit_button.html`: This template is used to render the record edit button in the formset table.
* `empty_state.html`: This template is used to render the empty state message when there are no records in the formset.

To override these templates, create a directory named `crispy_formset_modal` and a subdirectory named as per the template pack you're using (for instance, `bootstrap4`) in your project's templates directory. Then create your custom versions of `form.html`, `modal.html`, `edit_button.html`, `empty_estate.html`  and/or `table.html` in this directory.


## Adding Navigation Buttons to Modal

When overriding the `modal.html` template, you can add navigation buttons that allow users to navigate through formset records without closing the modal. This provides a more seamless editing experience.

To add navigation buttons, include the following HTML structure in your custom `modal.html` template:

```html
<div class="navigation-buttons">
  <button
    type="button"
    class="btn btn-sm btn-outline-secondary"
    data-formset-previous-button
  >
    <i class="bi bi-chevron-up" data-previous-icon></i>
  </button>
  <button
    type="button"
    class="btn btn-sm btn-outline-secondary"
    data-formset-next-button
  >
    <i class="bi bi-chevron-down" data-next-icon></i>
    <i class="bi bi-plus-lg" data-plus-icon style="display: none;"></i>
  </button>
</div>
```

### Navigation Button Behavior

* **Previous Button** (`data-formset-previous-button`): Navigates to the previous record in the formset. The button is automatically disabled when viewing the first record.

* **Next Button** (`data-formset-next-button`): Navigates to the next record in the formset. When viewing the last record, the button icon changes to a plus sign and clicking it will create a new record.

### Keyboard Navigation

Navigation buttons also support keyboard shortcuts:

* **Ctrl + Up Arrow**: Navigate to the previous record
* **Ctrl + Down Arrow**: Navigate to the next record (or create new record if on the last one)

The navigation buttons automatically handle state management, including disabling/enabling buttons based on the current position in the formset and updating icons appropriately.


With these customization options, you can modify Django Crispy Formset Modal to better suit the needs of your project. In the next section, we'll discuss how to troubleshoot common issues and where to seek further assistance.

