FROM node:21-alpine3.17

WORKDIR /app

COPY ./package* .

RUN npm ci --unsafe-perm=true

COPY . .

RUN chmod u+x ./start.sh

CMD ./start.sh
