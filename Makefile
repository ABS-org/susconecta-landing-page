.PHONY: network-run, network-stop, server-run, server-stop, server-monitor, server-console, server-debug

network-run:
	@docker network create -d bridge susconecta

network-stop:
	@docker network rm susconecta
	
webapp-image-build:
	sudo rm -rf webapp/bower_components
	sudo rm -rf webapp/node_modules
	cd webapp; docker build -t susconecta/webapp .
	
webapp-run:
	@docker run --name webapp-susconecta --net=susconecta -d -v `pwd`/webapp:/usr/src/app -w /usr/src/app -p 9000:9000 -p 3001:3001 susconecta/webapp gulp serve

webapp-logs:
	@docker logs webapp-susconecta

webapp-stop:
	@docker stop webapp-susconecta
	@docker rm webapp-susconecta

webapp-bower-update:
	@docker run --name webapp-susconecta -ti --rm -v `pwd`/webapp:/usr/src/app -w /usr/src/app susconecta/webapp bower update --allow-root

webapp-npm-install:
	@docker run --name webapp-susconecta -ti --rm -v `pwd`/webapp:/usr/src/app -w /usr/src/app susconecta/webapp npm install

webapp-dist:
	@docker run --name webapp-susconecta -ti --rm -v `pwd`/webapp:/usr/src/app -w /usr/src/app susconecta/webapp gulp

webapp-console:
	@docker run --name webapp-susconecta -ti --rm -v `pwd`/webapp:/usr/src/app -w /usr/src/app susconecta/webapp bash

server-run:
	@docker run --name server-susconecta --net=susconecta -d -v `pwd`/api:/app -w /app -p 8000:8000 node:4 npm start

server-stop:
	@docker stop server-susconecta
	@docker rm server-susconecta

server-npm-install:
	@docker run --name server-susconecta -ti --rm -v `pwd`/api:/app -w /app node:4 npm install

server-console:
	@docker run --name server-susconecta --net=susconecta -ti --rm -v `pwd`/api:/app -w /app -p 8000:8000 node:4 bash

server-debug:
	@docker run --name server-susconecta --net=susconecta -ti --rm -v `pwd`/api:/app -w /app -p 8000:8000 node:4 npm start

monitor:
	@docker stats webapp-susconecta server-susconecta
