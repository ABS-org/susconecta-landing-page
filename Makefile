.PHONY: image-build, run, logs, stop, bower-update, npm-install, dist, console, monitor 
	
image-build:
	sudo rm -rf webapp/bower_components
	sudo rm -rf webapp/node_modules
	cd webapp; docker build -t susconecta/webapp .
	
run:
	@docker run --name webapp-susconecta -d -v `pwd`:/usr/src/app -w /usr/src/app -p 9000:9000 -p 3001:3001 susconecta/webapp gulp serve

stop:
	@docker stop webapp-susconecta
	@docker rm webapp-susconecta

logs:
	@docker logs webapp-susconecta

bower-update:
	@docker run --name webapp-susconecta-cli -ti --rm -v `pwd`:/usr/src/app -w /usr/src/app susconecta/webapp bower update --allow-root

npm-install:
	@docker run --name webapp-susconecta-cli -ti --rm -v `pwd`:/usr/src/app -w /usr/src/app susconecta/webapp npm install

dist:
	@docker run --name webapp-susconecta-cli -ti --rm -v `pwd`:/usr/src/app -w /usr/src/app susconecta/webapp gulp

console:
	@docker run --name webapp-susconecta-cli -ti --rm -v `pwd`:/usr/src/app -w /usr/src/app susconecta/webapp bash
