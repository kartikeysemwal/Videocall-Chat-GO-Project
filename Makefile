#DEV
build-dev-chat-app:
	docker build -t chat-app -f containers/images/Dockerfile .

build-dev-chat-app-frontend:
	docker build -t chat-app-frontend -f chat-app-frontend/Dockerfile.frontend ./chat-app-frontend

build-dev-turn:
	docker build -t turn -f containers/images/Dockerfile.turn .

build-dev:
	docker build -t chat-app -f containers/images/Dockerfile . && docker build -t turn -f containers/images/Dockerfile.turn .

clean-dev:
	docker-compose -f containers/composes/dc.dev.yml.down

run-dev:
	docker-compose -f containers/composes/dc.dev.yml up

run-dev-frontend:
	docker-compose -f chat-app-frontend/frontend.dc.dev.yml up

build-run-dev:
	make build-dev && make run-dev

run-local:
	go build -gcflags=all="-N -l" cmd/main.go && main.exe 

run-frontend:
	cd chat-app-frontend && npm run dev