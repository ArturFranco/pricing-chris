FROM node:14

WORKDIR /app

COPY . .

RUN yarn

EXPOSE 3333

CMD [ "yarn", "start:docker"]
