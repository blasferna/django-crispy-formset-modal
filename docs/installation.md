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


With these steps, Django Crispy Formset Modal is now installed and ready to use in your Django project. Continue to the next section to learn how to prepare your project to use Django Crispy Formset Modal.
