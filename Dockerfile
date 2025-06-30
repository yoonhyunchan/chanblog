FROM node:24

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install

COPY . .

RUN npm run build

ENV DATABASE_URL="postgresql://chan:5372@host.docker.internal:5432/chandb?sslmode=disable"
ENV NODE_ENV="development"

EXPOSE 3000

CMD ["npm", "run", "start"]
