from django.shortcuts import render
from django.urls import reverse_lazy
from extra_views import CreateWithInlinesView

from demo.bootstrap4.forms import InvoiceForm, InvoiceWithPaymentTermsForm
from demo.inlines import InvoiceItemInline, PaymentTermInline
from demo.mixins import DemoViewMixin
from demo.models import Invoice


def index(request):
    views = [
        {
            "url_name": "demo:b4-invoice-and-items-management-example",
            "title": "Invoice and Items Management Example",
        },
        {
            "url_name": "demo:b4-invoice-with-payment-terms-example",
            "title": "Invoice with Items and Payment Terms Example",
        },
    ]
    return render(
        request,
        "demo_index.html",
        context={"views": views, "template_pack": "bootstrap4"},
    )


class CreateInvoiceDemoView(DemoViewMixin, CreateWithInlinesView):
    """
    ## Invoice and Items Management Example
    This example showcases a simple yet powerful use case of the `Django Crispy Formset
    Modal` package. Here, we are implementing an invoicing system where you can create
    an invoice and add multiple items to it dynamically using a modal formset.

    The main form is used to enter the invoice details such as the `invoice number`,
    `date`, and `client`. Then, there's a formset inside a modal for managing the items
    related to that invoice. Each item consists of a `description`, `quantity`, and
    `unit price`.

    ```python
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
    ```

    ```python
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
                Submit("submit", "Save"),
            )

        class Meta:
            model = Invoice
            fields = "__all__"
            widgets = {"date": DateInput}
    ```
    """

    title = "Invoice and Items Management Example"
    model = Invoice
    inlines = [InvoiceItemInline]
    form_class = InvoiceForm
    template_pack = "bootstrap4"
    index_url = reverse_lazy("demo:b4-index")
    success_url = reverse_lazy("demo:b4-invoice-and-items-management-example")


class CreateInvoiceWithPaymentTermsDemoView(DemoViewMixin, CreateWithInlinesView):
    """
    ## Invoice with Items and Payment Terms Example

    In this example you can see how to apply it to a view that has more than one
    inline formset.

    ```
    # Forms
    class PaymentTermForm(forms.ModelForm):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.helper = ModalEditFormHelper()
            self.helper.layout = ModalEditLayout(
                "due_date",
                "amount",
            )

        class Meta:
            model = PaymentTerm
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
                Fieldset(
                    "Payment Terms",
                    ModalEditFormsetLayout(
                        "PaymentTermInline",
                        list_display=["due_date", "amount"],
                    ),
                ),
                Submit("submit", "Save", css_class="btn btn-primary"),
            )

        class Meta:
            model = Invoice
            fields = "__all__"

    # Inline Formset
    class PaymentTermInline(InlineFormSetFactory):
        model = PaymentTerm
        form_class = PaymentTermForm
        fields = ["due_date", "amount"]
        factory_kwargs = {"extra": 0}


    # View
    class CreateInvoiceView(CreateWithInlinesView):
        model = Invoice
        inlines = [InvoiceItemInline, PaymentTermInline]
        form_class = InvoiceForm
    ```
    """

    title = "Invoice with Items and Payment Terms Example"
    model = Invoice
    inlines = [InvoiceItemInline, PaymentTermInline]
    form_class = InvoiceWithPaymentTermsForm
    template_pack = "bootstrap4"
    index_url = reverse_lazy("demo:b4-index")
    success_url = reverse_lazy("demo:b4-invoice-with-payment-terms-example")
