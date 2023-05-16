.PHONY: help lint lint/flake8 lint/black docs servedocs
.DEFAULT_GOAL := help

define PRINT_HELP_PYSCRIPT
import re, sys

for line in sys.stdin:
	match = re.match(r'^([a-zA-Z_-]+):.*?## (.*)$$', line)
	if match:
		target, help = match.groups()
		print("%-20s %s" % (target, help))
endef
export PRINT_HELP_PYSCRIPT


help:
	@python -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

lint/flake8: ## check style with flake8
	flake8 crispy_formset_modal demo
lint/black: ## check style with black
	black --check crispy_formset_modal demo
lint/isort: ## check imports order
	isort crispy_formset_modal demo --check --dif 

lint: lint/flake8 lint/black lint/isort ## check style

docs: ## generate Mkdos HTML documentation
	mkdocs build

servedocs: docs ## compile the docs watching for changes
	mkdocs serve

makemessages: ## run django makemessages command
	python manage.py makemessages --locale=es --ignore=venv --ignore=node_modules -ignore=staticfiles --ignore=site -a -d djangojs 
	python manage.py makemessages --locale=es --ignore=venv --ignore=site -e html -e py -a

compilemessages:
	python manage.py compilemessages --ignore=venv
