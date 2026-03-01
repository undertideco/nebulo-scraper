FROM node:18-alpine3.20

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "run", "start"]
