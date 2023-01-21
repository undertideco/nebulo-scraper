FROM node:16-bullseye

WORKDIR /app
COPY package.json .
COPY yarn.lock .

RUN yarn install && \
    yarn build

CMD ["yarn", "start"]
