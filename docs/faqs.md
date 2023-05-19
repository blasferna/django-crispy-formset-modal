# Frequently Asked Questions and Troubleshooting

In this section, we'll cover some common questions and provide solutions for typical issues users may face when using Django Crispy Formset Modal.

**Q: I've installed Django Crispy Formset Modal, but I don't see the changes in my formset. What could be the problem?**

A: Ensure that you've correctly added `'crispy_formset_modal'` to your `INSTALLED_APPS` setting. Also, make sure you've added the Django Crispy Formset Modal's JavaScript file in your template and properly included `jQuery`.


**Q: I'm trying to use a different template pack, but the formset still uses the default styles. What could be wrong?**

A: Check that you've set the `CRISPY_TEMPLATE_PACK` setting in your Django settings to your desired template pack. Also, ensure that you've included the respective CSS and JS files for your selected template pack in your template.

**Q: I've set the modal_size and modal_placement options, but the modal does not change its size or placement. What could be the issue?**

A: Check that you're using the `ModalSize` and `ModalPlacement` classes from the `crispy_formset_modal` package to set these options. Also, ensure that the options are set in the `ModalEditFormsetLayout` object and not elsewhere.

**Q: I've overridden the default templates, but the formset still uses the original templates. What should I do?**

A: Make sure you've created your custom templates in the correct location. For example, if you're using the Bootstrap 4 template pack and want to override the modal template, your custom template should be in a directory named `crispy_formset_modal/bootstrap4/modal.html` in your project's templates directory.

In the event that you encounter an `issue` not covered here, please raise an issue on the Django Crispy Formset Modal's [GitHub page](https://github.com/blasferna/django-crispy-formset-modal/issues). We appreciate your contributions to improving this package.

In the next section, we will provide some examples of how to use Django Crispy Formset Modal in various scenarios.


