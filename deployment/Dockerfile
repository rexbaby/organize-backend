FROM node:20-alpine

WORKDIR /app

ADD dist /app/dist
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
ADD tsconfig.json /app/tsconfig.json
ADD tsconfig.build.json /app/tsconfig.build.json

RUN [ "npm", "install" ]

CMD [ "npm", "start" ]
