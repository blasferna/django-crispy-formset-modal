from django.shortcuts import render
from django.urls import reverse_lazy

from demo.bootstrap4.views import CreateInvoiceDemoView as B4CreateInvoiceDemoView
from demo.bootstrap4.views import (
    CreateInvoiceWithPaymentTermsDemoView as B4CreateInvoiceWithPaymentTermsDemoView,
)
from demo.bootstrap4.views import CreateProjectDemoView as B4CreateProjectDemoView
from demo.tailwind.forms import InvoiceForm, InvoiceWithPaymentTermsForm, ProjectForm


def index(request):
    views = [
        {
            "url_name": "demo:tailwind-invoice-and-items-management-example",
            "title": "Invoice and Items Management Example",
        },
        {
            "url_name": "demo:tailwind-invoice-with-payment-terms-example",
            "title": "Invoice with Items and Payment Terms Example",
        },
        {
            "url_name": "demo:tailwind-project-management-example",
            "title": "Project management example",
        },
    ]
    return render(
        request,
        "demo_index.html",
        context={"views": views, "template_pack": "tailwind"},
    )


class CreateInvoiceDemoView(B4CreateInvoiceDemoView):
    form_class = InvoiceForm
    template_pack = "tailwind"
    index_url = reverse_lazy("demo:tailwind-index")
    success_url = reverse_lazy("demo:tailwind-invoice-and-items-management-example")


class CreateInvoiceWithPaymentTermsDemoView(B4CreateInvoiceWithPaymentTermsDemoView):
    form_class = InvoiceWithPaymentTermsForm
    template_pack = "tailwind"
    index_url = reverse_lazy("demo:tailwind-index")
    success_url = reverse_lazy("demo:tailwind-invoice-with-payment-terms-example")


class CreateProjectDemoView(B4CreateProjectDemoView):
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
    ```
    """
    form_class = ProjectForm
    template_pack = "tailwind"
    index_url = reverse_lazy("demo:tailwind-index")
    success_url = reverse_lazy("demo:tailwind-project-management-example")
