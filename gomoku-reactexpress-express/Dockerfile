FROM node:16-alpine

WORKDIR /gomoku-reactexpress-express

ADD ./package.json ./
ADD ./yarn.lock ./
ADD ./tsconfig.json ./
ADD ./.env ./
# add --ignore-scripts to skip postinstall script
RUN yarn --ignore-scripts 

CMD yarn dev