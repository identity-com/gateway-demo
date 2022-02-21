FROM node:16-alpine3.14

# Create app directory
WORKDIR /var/gateway-demo/app/

COPY . .

RUN yarn

EXPOSE 3000

CMD [ "node", "src/index.js" ]
