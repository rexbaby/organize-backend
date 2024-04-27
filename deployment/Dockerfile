FROM node:18-alpine

WORKDIR /app

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

RUN [ "npm", "install" ]

CMD ["npm", "start" ]
