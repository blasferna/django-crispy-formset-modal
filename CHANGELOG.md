# Changelog

## [0.2] - 2024-03-02

### Added
* Added functionality to customize the appearance of the edit button by overriding the template by @blasferna in https://github.com/blasferna/django-crispy-formset-modal/pull/12

### Fixed
* Fix: Declare 'checked' Variable to Resolve ReferenceError by @blasferna in https://github.com/blasferna/django-crispy-formset-modal/pull/2
* Add missing 'textarea' type by @blasferna in https://github.com/blasferna/django-crispy-formset-modal/pull/10


## [0.1] - 2023-05-19

### Added
- Built and added publish workflow.
- Introduced invoice with payment terms example in the documentation.
- Improved documentation and added documentation deployment workflow.
- Added support for older versions of crispy_forms.
- Provided support for Bulma, Tailwind and Bootstrap5 template packs.
- Included style improvements.
- Allowed user-defined modal size and placement.
- Established app for demo.
- Implemented internationalization support.
- Added success message to demo views.

### Fixed
- Resolved `CSRF verification failed` on fly.dev issue.
- Rectified fly secret and modal size.
- Removed unnecessary argument.
- Sorted out event conflict between modal input and submit.

### Changed
- Updated README.md.
- Deployed demo to Fly.dev.
- Removed unused imports.
- Refactored css classes, forms, js output, demo view url style and table.html.
- Updated Makefile.
- Created setup.cfg and .editorconfig.
- Added lint checker and applied lint check for demo app.
- Implemented code formatting.

### Removed
- Nothing was removed in this version.

### Deprecated
- Nothing was deprecated in this version.
