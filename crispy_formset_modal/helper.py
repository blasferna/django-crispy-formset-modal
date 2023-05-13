from crispy_forms.helper import FormHelper


class ModalEditFormHelper(FormHelper):
    form_tag = False
    disable_csrf = True
    include_media = False
