# django-crispy-formset-modal

Reusable Django app that provides an easy way to manage and manipulate formsets using modals with Django Crispy Forms. It enables you to dynamically add, edit, and delete formsets on the frontend.

![demo-view](https://github.com/blasferna/django-crispy-formset-modal/assets/8385910/8ee06376-e166-446c-9743-3bdbcaadf0d8)


## Features

* Dynamic formset operations: Add, edit, and delete formsets dynamically in a modal on the frontend.
* Generates an HTML table according to the layout definition, allowing you to determine which fields to display as columns.
* Provides the option to define which numeric fields will be used for a totalizer at the footer of the corresponding field's column.
* Enables mass deletion of records from the HTML table, thanks to the generation of a selection column with checkboxes that can be selected individually or collectively to delete multiple records at once.
* Offers support for various templates packs, including [Bootstrap 4](https://github.com/django-crispy-forms/crispy-bootstrap4), [Bootstrap 5](https://github.com/django-crispy-forms/crispy-bootstrap5), [Tailwind](https://github.com/django-crispy-forms/crispy-tailwind), and [Bulma](https://github.com/ckrybus/crispy-bulma).

## Dependencies

* [Django Crispy Forms](https://github.com/django-crispy-forms/django-crispy-forms): Django Crispy Formset Modal relies on Django Crispy Forms for form rendering
* [Django Extra Views](https://github.com/AndrewIngram/django-extra-views): For handling views with formsets.
* jQuery: Used to enable dynamic functionality.
## Installation

1. Install the package using pip:

```
pip install django-crispy-formset-modal
```

2. Add `crispy_formset_modal` to your `INSTALLED_APPS` in `settings.py`:

```python
INSTALLED_APPS = [
    ...
    'crispy_formset_modal',
    ...
]
```

## Usage

For detailed instructions on how to use Django Crispy Formset Modal, please refer to the [documentation](https://blasferna.github.io/django-crispy-formset-modal/) and check out the [demo](https://django-crispy-formset-modal.fly.dev/) for practical examples.

## Examples

The [demo](https://django-crispy-formset-modal.fly.dev/) provides various examples of how to use Django Crispy Formset Modal in different scenarios.

### Running the Demo App Locally

If you'd like to run the demo application on your local machine. Please follow the steps below:

#### Instructions


1. Clone this repository to your local machine:

```
git clone https://github.com/blasferna/django-crispy-formset-modal.git
```

2. Navigate to the project's directory:

```
cd django-crispy-formset-modal
```

3. Set up a virtual environment. This step helps to isolate the Python environment for this project:

```
python -m venv venv
```

4. Activate the virtual environment:

`On Windowds`

```
.\venv\Scripts\activate
```

`On Unix or MacOS:`

```
source venv/bin/activate
```

5. Install the required dependencies:

```
pip install -r requirements.txt
```

6. Apply migrations:

```
python manage.py migrate
```

7. Start the local development server:

```
python manage.py runserver
```

8. Visit `http://localhost:8000` on your browser to explore the demo application.


## License

Django Crispy Formset Modal is released under the [MIT License](https://github.com/blasferna/django-crispy-formset-modal/blob/main/LICENSE).


