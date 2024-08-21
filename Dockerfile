FROM node:20-alpine

WORKDIR /usr/src/app

# Copy app source
COPY . .

RUN yarn
RUN yarn build

EXPOSE 8000
EXPOSE 3000

CMD [ "yarn", "start" ]
