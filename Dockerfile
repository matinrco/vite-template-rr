FROM node:24-alpine
RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
RUN yarn install --immutable
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
