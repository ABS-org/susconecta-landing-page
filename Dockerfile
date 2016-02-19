FROM node:4.2.4

RUN npm install -g gulp-cli bower

WORKDIR /app