from django.shortcuts import render
from django.urls import reverse_lazy
from extra_views import CreateWithInlinesView

from demo.bootstrap4.forms import InvoiceForm, InvoiceWithPaymentTermsForm, ProjectForm
from demo.bootstrap4.inlines import TaskInline
from demo.inlines import InvoiceItemInline, PaymentTermInline
from demo.mixins import DemoViewMixin
from demo.models import Invoice, Project


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
        {
            "url_name": "demo:b4-project-management-example",
            "title": "Project management example",
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


class CreateProjectDemoView(DemoViewMixin, CreateWithInlinesView):
    """
    ## Project management Example
    This demo showcases how to manage a Project with multiple associated Tasks
    using Django Crispy Formset Modal. A Project can have multiple Tasks, each
    assigned to a different user.

    The demo app includes some sample users that can be assigned to tasks. This
    demonstrates the autocomplete functionality of Django Autocomplete Light.

    ```python
    class TaskForm(forms.ModelForm):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.helper = ModalEditFormHelper()
            self.helper.layout = ModalEditLayout(
                "title",
                "assigned_to",
            )

        class Meta:
            model = Task
            fields = "__all__"
            widgets = {
                "assigned_to": autocomplete.ModelSelect2(
                    url="user-autocomplete"
                )
            }
    ```

    ```python
    class ProjectForm(forms.ModelForm):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.helper = FormHelper()
            self.helper.layout = Layout(
                Row(Column("name"), Column("description")),
                Fieldset(
                    "Tasks",
                    ModalEditFormsetLayout(
                        "TaskInline",
                        edit_on_table=True,
                        list_display=["title", "assigned_to"],
                    ),
                ),
                Submit("submit", "Save", css_class="btn btn-primary"),
            )

        class Meta:
            model = Project
            fields = "__all__"
            widgets = {"date": DateInput}
    ```
    """

    class Media:
        js = [
            "admin/js/vendor/select2/select2.full.js",
            "autocomplete_light/autocomplete_light.min.js",
            "autocomplete_light/select2.min.js",
        ]
        css = {
            "screen": [
                "admin/css/vendor/select2/select2.min.css",
                "select2-bootstrap4.min.css"
            ]
        }

    title = "Project management Example"
    model = Project
    inlines = [TaskInline]
    form_class = ProjectForm
    template_pack = "bootstrap4"
    index_url = reverse_lazy("demo:b4-index")
    success_url = reverse_lazy("demo:b4-project-management-example")
