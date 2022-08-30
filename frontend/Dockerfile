FROM alpine:3.15

RUN apk update && apk upgrade && apk add --no-cache npm

WORKDIR /app

COPY . .

RUN npm install

CMD [ "npm", "run", "start" ]
