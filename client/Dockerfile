FROM node:21-alpine3.17

# Dependencies
COPY ./package* /client/
WORKDIR /client

RUN npm ci --unsafe-perm=true

WORKDIR /
COPY . /client
WORKDIR /client

CMD npm run dev
