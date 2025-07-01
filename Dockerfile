FROM node:24

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install

COPY .env .env

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
