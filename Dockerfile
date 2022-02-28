FROM node:16-alpine3.14

# Create app directory
WORKDIR /var/gateway-demo/app/

COPY backend/ .

ENV STAGE=prod

RUN yarn

EXPOSE 80

CMD [ "node", "src/index.js" ]
