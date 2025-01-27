#!make
SHELL := /bin/bash
# Load .env file
ifneq (,$(wildcard .env))
    include .env
    export
endif

.PHONY        : help install build-cli build-core build CLI
.DEFAULT_GOAL = help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

init: ## Initialize the project
	make install
	make build

install: ## Install the dependencies
	npm install

webpage: ## Run the webpage localy
	npm run format
	cd website && npm run start
	
send_mail: ## Send newsletter mail
	cp -n .env.sample .env
	npx ts-node curator/src/mail_agent/newsletter_script.ts
	
build: ## Compile the project
	npm run build
	npm run format

run: ## Summarize a list of articles
	npm run format
	npm --workspace curator run start

dev: ## Run the CLI in development mode
	npm run format
	npm --workspace website run dev

conv_agent: ## Test the conversational agent with mail
	npm run format
	npm --workspace conversational_agent run start

conv_agent_test: ## Test the conversational agent
	npm run format
	npm --workspace conversational_agent run test

clean: ## To clean the project
	rm -f package-lock.json
	rm -rf node_modules

# Start ngrok on a specific port
start_ngrok:
	npx ngrok config add-authtoken $(NGROK_AUTH_TOKEN)
	@echo "Starting ngrok on port 3000"
	npx ngrok http 3000