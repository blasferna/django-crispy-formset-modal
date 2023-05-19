Installing Django Crispy Formset Modal is a straightforward process, made even simpler if you're familiar with Python's package manager, pip. Follow these steps to install and set up Django Crispy Formset Modal in your Django project.

## Step 1: Install the Package

To start, open your terminal and install the package using pip:

```bash
pip install django-crispy-formset-modal
```

This command will download and install Django Crispy Formset Modal from the Python Package Index (PyPI) to your Python environment.


## Step 2: Add the App to Your Django Project

Once the package is installed, you'll need to add it to your Django project. Open your Django project's settings.py file and add 'crispy_formset_modal' to the `INSTALLED_APPS` list:


```python
INSTALLED_APPS = [
    ...
    'crispy_formset_modal',
    ...
]
```

!!! note

    Django Crispy Formset Modal relies on Django Crispy Forms and Django Extra Views. Ensure that these are also installed and added to your `INSTALLED_APPS` list


## 3. Include the JavaScript file

Django Crispy Formset Modal relies on a JavaScript file to handle formset manipulation on the client side. You need to include this file in your Django templates where you plan to use Django Crispy Formset Modal. This file should be added after jQuery, which is also a dependency.

Here's how to include the JavaScript file in your template:


```html
<script src="{% static 'crispy_formset_modal/js/crispy-formset-modal.min.js' %}"></script>
```

Make sure `{% load static %}` is present at the top of your template to use the `{% static %}` template tag.

Here's a complete example of a template including jQuery and the Django Crispy Formset Modal JavaScript file:

```html
{% load static %}

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Other head tags -->
</head>
<body>
    <!-- Your content -->

    <!-- Include jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <!-- Include Django Crispy Formset Modal's JS -->
    <script src="{% static 'crispy_formset_modal/js/crispy-formset-modal.min.js' %}"></script>
</body>
</html>
```

Remember to include these scripts at the end of your HTML body to ensure that they do not block rendering of your page content.

With these steps, Django Crispy Formset Modal is now installed and ready to use in your Django project. Continue to the next section to learn how to prepare your project to use Django Crispy Formset Modal.
