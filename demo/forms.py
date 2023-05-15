from crispy_forms.helper import FormHelper
from crispy_forms.layout import Column, Fieldset, Layout, Row, Submit
from django import forms

from crispy_formset_modal.helper import ModalEditFormHelper
from crispy_formset_modal.layout import ModalEditFormsetLayout, ModalEditLayout
from demo.models import Invoice, InvoiceItem
from demo.widgets import DateInput


class InvoiceItemForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = ModalEditFormHelper()
        self.helper.layout = ModalEditLayout(
            "description",
            "quantity",
            "unit_price",
        )

    class Meta:
        model = InvoiceItem
        fields = "__all__"


class InvoiceForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(Column("invoice_number"), Column("date")),
            "client",
            Fieldset(
                "Items",
                ModalEditFormsetLayout(
                    "InvoiceItemInline",
                    list_display=["description", "quantity", "unit_price"],
                ),
            ),
            Submit("submit", "Save", css_class="btn btn-primary float-right"),
        )

    class Meta:
        model = Invoice
        fields = "__all__"
        widgets = {"date": DateInput}
