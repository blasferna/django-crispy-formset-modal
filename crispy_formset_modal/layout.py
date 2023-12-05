from crispy_forms.layout import Div, Field, LayoutObject
from crispy_forms.layout import Layout as CrispyLayout
from django import forms
from django.conf import settings
from django.forms.formsets import DELETION_FIELD_NAME
from django.forms.utils import pretty_name
from django.template.loader import render_to_string

from crispy_formset_modal import ModalPlacement, ModalSize

from .configs import DEFAULT_CONFIG

HIDDEN_CLASSES = {
    "tailwind": "hidden",
    "bootstrap4": "d-none",
    "bootstrap5": "d-none",
    "bulma": "is-hidden",
}

USER_CONFIG = getattr(settings, "CRISPY_FORMSET_MODAL", DEFAULT_CONFIG)


class ModalEditLayout(CrispyLayout):
    def __init__(self, *fields):
        css_class = HIDDEN_CLASSES.get(settings.CRISPY_TEMPLATE_PACK, "")

        self.fields = list(
            fields
            + (Div(Field("DELETE", css_class="formset-delete"), css_class=css_class),)
        )


class ModalEditFormsetLayout(LayoutObject):
    template = "crispy_formset_modal/{template_pack}/table.html"

    def __init__(
        self,
        formset_name,
        list_display=[],
        sum_columns=[],
        modal_size=ModalSize.MD,
        modal_placement=ModalPlacement.CENTER,
    ):
        self.formset_name = formset_name
        self.list_display = list_display
        self.sum_columns = sum_columns
        self.modal_size = modal_size
        self.modal_placement = modal_placement

    def get_html_name(self, empty_form, field):
        return empty_form[field].html_name.split("__prefix__")[1][1:]

    def has_summary(self, field):
        return field in self.sum_columns

    def get_headers(self, empty_form):
        fields = empty_form.fields
        # id, delete and hidden fields are excluded by the default list display fields
        list_display = [
            {
                "field": self.get_html_name(empty_form, k),
                "title": pretty_name(k) if v.label is None else v.label,
                "type": self._get_field_type(v),
                "has_summary": self.has_summary(k),
            }
            for k, v in fields.items()
            if k not in ("id", DELETION_FIELD_NAME)
            and getattr(v.widget, "input_type", None) != "hidden"
        ]
        if not self.list_display:
            return list_display
        return [
            {
                "field": self.get_html_name(empty_form, field),
                "title": pretty_name(field)
                if fields.get(field).label is None
                else fields.get(field).label,
                "type": self._get_field_type(fields.get(field)),
                "has_summary": self.has_summary(field),
            }
            for field in self.list_display
            if field not in ("id", DELETION_FIELD_NAME)
            and getattr(fields.get(field).widget, "input_type", None) != "hidden"
        ]

    def _get_field_type(self, field):
        _type = "text"
        if isinstance(field, forms.DecimalField):
            _type = "numeric"
        if isinstance(field, forms.FloatField):
            _type = "numeric"
        if isinstance(field, forms.IntegerField):
            _type = "numeric"
        if isinstance(field, forms.BooleanField):
            _type = "bool"
        if isinstance(field, forms.DateField):
            _type = "date"
        return _type

    def render(self, *args, **kwargs):
        form = args[0]  # noqa F841
        if len(args) > 2:
            context = args[2]
        else:
            context = args[1]
        template_pack = kwargs.get("template_pack", settings.CRISPY_TEMPLATE_PACK)
        formset = None
        view = context.get("view")
        inlines = context.get("inlines", [])

        i = 0
        for inline in view.inlines:
            if inline.__name__ == self.formset_name:
                formset = inlines[i]
            i += 1

        context.update(
            {
                "formset": formset,
                "list_display": self.list_display,
                "headers": self.get_headers(formset.empty_form),
                "has_footer": len(self.sum_columns) > 0,
                "form_template_name": (
                    f"crispy_formset_modal/{template_pack}/form.html"
                ),
                "modal_template_name": (
                    f"crispy_formset_modal/{template_pack}/modal.html"
                ),
                "template_pack": template_pack,
                "modal_size": self.modal_size,
                "modal_placement": self.modal_placement,
                "edit_button_template_name": USER_CONFIG["edit_button_template_name"][
                    template_pack
                ],
            }
        )

        template = self.template.format(template_pack=template_pack)
        return render_to_string(template, context.flatten())
