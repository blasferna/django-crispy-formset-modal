from crispy_forms.helper import FormHelper
from crispy_forms.layout import Column, Div, Fieldset, Layout, Row
from crispy_tailwind.layout import Submit
from dal import autocomplete
from django import forms

from crispy_formset_modal.helper import ModalEditFormHelper
from crispy_formset_modal.layout import ModalEditFormsetLayout, ModalEditLayout
from demo.models import Invoice, Project, Task
from demo.widgets import DateInput


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
            Div(
                Submit(
                    "submit",
                    "Save",
                    css_class=(
                        "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4"
                        " focus:ring-blue-300 font-medium rounded-lg text-sm"
                        " px-5 py-2.5 mb-2"
                    ),
                ),
                css_class="flex justify-end",
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
            Row(Column("invoice_number"), Column("date")),
            "client",
            Fieldset(
                "Items",
                ModalEditFormsetLayout(
                    "InvoiceItemInline",
                    list_display=["description", "quantity", "unit_price"],
                ),
            ),
            Fieldset(
                "Payment Terms",
                ModalEditFormsetLayout(
                    "PaymentTermInline",
                    list_display=["due_date", "amount"],
                ),
            ),
            Div(
                Submit(
                    "submit",
                    "Save",
                    css_class=(
                        "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4"
                        " focus:ring-blue-300 font-medium rounded-lg text-sm"
                        " px-5 py-2.5 mb-2"
                    ),
                ),
                css_class="flex justify-end",
            ),
        )

    class Meta:
        model = Invoice
        fields = "__all__"
        widgets = {"date": DateInput}


class ProjectForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            "name",
            "description",
            Fieldset(
                "Tasks",
                ModalEditFormsetLayout(
                    "TaskInline",
                    edit_on_table=True,
                    list_display=["title", "assigned_to"],
                ),
            ),
            Div(
                Submit(
                    "submit",
                    "Save",
                    css_class=(
                        "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4"
                        " focus:ring-blue-300 font-medium rounded-lg text-sm"
                        " px-5 py-2.5 mb-2"
                    ),
                ),
                css_class="flex justify-end",
            ),
        )

    class Meta:
        model = Project
        fields = "__all__"
        widgets = {"date": DateInput}
