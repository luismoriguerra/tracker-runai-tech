

dev:
	npm run dev

build-prod:
	npm run pages:build

deploy:
	npx wrangler d1 migrations apply remodeling-tracker-db --remote
	npm run deploy
