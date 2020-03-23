FROM node:alpine as builder

WORKDIR /app

COPY package.json .
RUN npm install --production

COPY . .

ARG GRAPHQL_ENDPOINT
RUN REACT_APP_GRAPHQL_ENDPOINT=${GRAPHQL_ENDPOINT} npm run build

FROM nginx:alpine

LABEL maintainer="Alexander Ivanov <oz.sasha.ivanov@gmail.com>"

# Target project
COPY --from=builder /app/build/ /var/www/

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
