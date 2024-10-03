# docker compose -f docker-compose.dev.yml up --build
# docker compose -f docker-compose.dev.yml down

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start:prod" ]