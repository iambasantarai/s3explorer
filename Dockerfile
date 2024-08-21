FROM node:20-alpine

WORKDIR /usr/src/app

# Copy app source
COPY . .

RUN yarn

EXPOSE 8000
EXPOSE 3000

CMD [ "yarn", "dev" ]
