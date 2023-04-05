# syntax=docker/dockerfile:1
FROM node:18-alpine
RUN apk add --update make
WORKDIR /
COPY . .
CMD ["sh", "build.sh"]