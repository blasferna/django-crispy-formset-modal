# Changelog

## [0.9] 2024-05-27

* Fixed Bootstrap 5 checkbox styling.
* Modal overlay z-index increased.


## [0.8] 2024-03-25

* Add ability to customize empty state message


## [0.7] 2024-03-25

### Fixed

* Resolves unexpected closure of nested modals when the parent is a Bootstrap modal.
* Improve formset initialization.


## [0.6] 2024-03-13

### Added 
* Add event handlers for formset additions and deletions.
* Improve error highlighting.

## [0.5] 2024-03-08

* Typo fix in `window.crispyFormsetModal` object declaration.


## [0.4] - 2024-03-08

### Added
* Created `window.crispyFormsetModal.refresh` to recreate all formsets. 

## [0.3] - 2024-03-04

### Fixed
* Avoid 'ModalEditFormsetLayout' object has no attribute 'fields' by @blasferna in https://github.com/blasferna/django-crispy-formset-modal/pull/14

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
