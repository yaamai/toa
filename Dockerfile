FROM node:18-alpine
WORKDIR /build
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
ENV ASSETS=build
ENTRYPOINT ["node", "src/server/index.js"]
