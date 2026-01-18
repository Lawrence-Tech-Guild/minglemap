.PHONY: seed dev-up dev-down

seed:
	python manage.py seed

dev-up:
	docker compose down --remove-orphans
	docker compose up -d --build

dev-down:
	docker compose down --remove-orphans
