FROM node:16.13.1-alpine3.14

WORKDIR /usr/src/app

COPY . .

RUN yarn 

RUN  yarn build

CMD yarn dev