FROM node:20-alpine

WORKDIR /app

ADD dist /app/dist
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

RUN [ "npm", "install" ]

CMD [ "npm", "start" ]
