FROM node:24-alpine
RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
RUN yarn install --immutable
COPY . .
RUN yarn build
ENV PORT=3000
EXPOSE ${PORT}
CMD ["yarn", "start"]
