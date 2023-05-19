from crispy_forms.helper import FormHelper
from crispy_forms.layout import HTML, Div, Layout, Submit
from django import forms

from crispy_formset_modal.layout import ModalEditFormsetLayout
from demo.models import Invoice
from demo.widgets import DateInput


class InvoiceForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Div(
                Div("invoice_number", css_class="column"),
                Div("date", css_class="column"),
                css_class="columns",
            ),
            "client",
            Div(
                HTML("<h3>Items</h3>"),
                ModalEditFormsetLayout(
                    "InvoiceItemInline",
                    list_display=["description", "quantity", "unit_price"],
                ),
            ),
            Div(
                Submit(
                    "submit",
                    "Save",
                    css_class=("button is-primary"),
                ),
                css_class="is-flex is-justify-content-end",
            ),
        )

    class Meta:
        model = Invoice
        fields = "__all__"
        widgets = {"date": DateInput}


class InvoiceWithPaymentTermsForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Div(
                Div("invoice_number", css_class="column"),
                Div("date", css_class="column"),
                css_class="columns",
            ),
            "client",
            Div(
                HTML("<h3>Items</h3>"),
                ModalEditFormsetLayout(
                    "InvoiceItemInline",
                    list_display=["description", "quantity", "unit_price"],
                ),
            ),
            Div(
                HTML("<h3>Payment Terms</h3>"),
                ModalEditFormsetLayout(
                    "PaymentTermInline",
                    list_display=["due_date", "amount"],
                ),
            ),
            Div(
                Submit(
                    "submit",
                    "Save",
                    css_class=("button is-primary"),
                ),
                css_class="is-flex is-justify-content-end",
            ),
        )

    class Meta:
        model = Invoice
        fields = "__all__"
        widgets = {"date": DateInput}
