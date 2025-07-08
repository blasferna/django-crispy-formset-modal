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

docs: ## generate Mkdos HTML documentation
	uv run mkdocs build

servedocs: docs ## compile the docs watching for changes
	uv run mkdocs serve

makemessages: ## run django makemessages command
	uv run manage.py makemessages --locale=es --ignore=venv --ignore=node_modules -ignore=staticfiles --ignore=site -a -d djangojs 
	uv run manage.py makemessages --locale=es --ignore=venv --ignore=site -e html -e py -a

compilemessages: ## run django compilemessages command
	uv run manage.py compilemessages --ignore=venv

buildtailwind: ## build Tailwindcss
	npm run build:tailwind

buildstatic: ## build javascript and tailwind code
	npm run build

requirements: ## Generate requirements.txt from pyproject.toml
	@echo "Generating requirements.txt..."
	uv pip compile pyproject.toml -o requirements.txt --group dev

