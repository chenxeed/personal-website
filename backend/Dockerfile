FROM node:21-alpine3.17

WORKDIR /app

COPY ./package* .

RUN npm install --unsafe-perm=true

COPY . .

EXPOSE 3001

CMD [ "npm", "run", "start:dev" ]
