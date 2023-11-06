FROM node:21-alpine3.17

# Dependencies
COPY ./package* /frontend/
WORKDIR /frontend

RUN npm install --unsafe-perm=true

WORKDIR /
COPY . /frontend
WORKDIR /frontend

CMD npm run start
