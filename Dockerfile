FROM node:24 AS builder

WORKDIR /app

COPY package.json  package-lock.json ./

RUN npm install

COPY .env .env

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html  # React라면
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
